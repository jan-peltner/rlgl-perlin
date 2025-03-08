#!/bin/sh

set -ex

cc -Wall -Wextra -o bin/rlgl src/main.c -lraylib -lm

mkdir -p bin

cd bin

# copy all fragment and vertex shaders to bin
cp ../shaders/*.frag .
cp ../shaders/*.vert .

