#!/bin/bash

##############################################################################
# Read the version in package.json and make an array of major.minor.patch
##############################################################################
function readVersion() {
    VERSION_STRING=`cat package.json | grep "version" | sed -e 's/[ ^I]*"version": "\(.*\)"\(.*\)/\1/g'`
    VERSION=`echo ${VERSION_STRING} | tr "." "\n"`
    echo $VERSION
}


##############################################################################
# Make a new version :
#  * increment the version number into package.jso
#  * commit it
#  * return the new version
#
#   @param type The type of the new version (ie. Major, Minor or patch)
#   @param major version
#   @param minor version
#   @param patch version
##############################################################################
function makeNewVersion() {
    if [ -z "$1" ]; then
        echo "Type of version is mandatory for the function `makeNewVersion`"
        exit 3
    fi

    # Rename var
    major=$2
    minor=$3
    patch=$4

    case $1 in
        Major )
            major=$((${major##}+1))
            minor=0
            patch=0
            ;;
        Minor )
            minor=$((${minor##}+1))
            patch=0
            ;;
        Patch )
            patch=$((${patch##}+1))
            ;;
        * )
            exit;;
    esac

    NEW_VERSION="$major.$minor.$patch"

    # Replace in package.json
    sed -i "s/\"version\": \"\(.*\)\",/\"version\": \"$NEW_VERSION\",/g" ./package.json
    echo $NEW_VERSION
}


##############################################################################
# Build the project
##############################################################################
function build() {
    # clean the repo
    echo "Cleaning project"
    gulp clean

    # Build project
    echo "Building project"
    gulp build
}


##############################################################################
# Publish the project
#
#   @param $1 the string version to publish
##############################################################################
function publish() {
    if [ -z "$1" ]; then
        echo "Version is mandatory for the function `publish`"
        exit 3
    fi

    # publsih on NPM
    echo "NPM publish"
    npm publish

    # Create a git tag
    echo "Create & push tag $1"
    git tag $1
    git push --tags
}

##############################################################################
# Deploy function
#
#   @param type The type of the new version (ie. Major, Minor or patch)
#   @param major version
#   @param minor version
#   @param patch version
##############################################################################
function deploy() {
    VERSION=$(makeNewVersion $1 $2 $3 $4)
    build
    if [[ $1 != 'RAS' ]]
    then
        git commit -am "Changing version to $VERSION"
    fi
    publish $VERSION
}

##############################################################################
# MAIN
##############################################################################

# Get the current version
CURRENT_ARRAY_VERSION=$(readVersion)
echo "Current version is $CURRENT_ARRAY_VERSION"

# Ask user if this version is major, minor or a patch
echo "This script will publish a new version on NPM"
echo "Do you want to make a new version : "
select type in "Major" "Minor" "Patch" ; do
    case $type in
        Major )
            deploy 'Major' $CURRENT_ARRAY_VERSION
            exit;;
        Minor )
            deploy 'Minor' $CURRENT_ARRAY_VERSION
            exit;;
        Patch )
            deploy 'Patch' $CURRENT_ARRAY_VERSION
            exit;;
    esac
done
