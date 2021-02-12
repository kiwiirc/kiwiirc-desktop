# Kiwi IRC Desktop
This project is an electron builder/packager for (kiwiirc)[https://github.com/kiwiirc/kiwiirc]

## Building from source
#### Dependencies
Before you can build or start to develop on Kiwi IRC Desktop, make sure to have the following installed on your system:
* [Nodejs](https://nodejs.org/)
* [Yarn](https://yarnpkg.com/)  *note: yarnpkg package on ubuntu*

##### You may also need other packages for multi os/distro building
see [multi-platform-build](https://www.electron.build/multi-platform-build) for more info

## Getting started
These tasks are required first for both development and production builds

``` bash
$ git clone https://github.com/kiwiirc/kiwiirc-desktop.git
$ yarn
```

## Starting in development mode
``` bash
$ yarn dev
```

## Building default packages/zips
``` bash
$ yarn build
```

## Building custom packages/zips
First ensure that kiwiirc is built using:
``` bash
$ yarn build:kiwi
```

To build with custom switches use `build:dist`
for more info see [cli commands](https://www.electron.build/cli)

``` bash
$ yarn build:dist --dir --x64
```
