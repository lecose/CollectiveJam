
# Setup

1 - Install nvm using
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```
2 - Install Node using nvm
```
nvm install node
```
3 - Clone the WebChuck repository
```
git clone https://github.com/ccrma/webchuck.git
```
4 - In the 'webchuck' folder install npm dependencies
```
cd webchuck
npm install
```
5 - Build webchuck
```
npm run build
```
6 - Clone this repository
```
git clone git@github.com:lecose/CollectiveJam.git
cd CollectiveJam
```
7 - Make a new folder 'src'
```
mkdir src
```
8 - Copy the files 'webchuck_host.js', 'webchuck.js' and 'webchuck.wasm' from the 'webchuck/src' folder in the new 'src' folder of this project
```
cp ../webchuck/src/{webchuck_host.js,webchuck.js,webchuck.wasm} ./src
```
9 - Setup a local server
```
python3 -m http.server 8080
```
10 - Connect to the local server ('http://localhost:8080') on any browser and try the demo
