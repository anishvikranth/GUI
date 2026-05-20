# Anveshak Rover User Interface
I still don't fully understand all this but lite

# Architecture 
## src
### components
This folder contains the independent React components used in the ARUI
// List down the components here

### layout
Just here for the vibes

### ros
rosClient.js: This file connects to rosbridge, rosbridge is the thing that translates ROS2 info streams to JSON for React

topics.js: Whichever ROS2 topics you want to use in the GUI, just add them in this, so that just by importing TOPICS, you can use whatever topics in whichever file.

#### hooks
Still havent figured this thing out.

# Features to be added
* __Orin health__: We need to add a feature such that there is an arrow on the left side and that will show the status and info about Orin. Click the arrow again to close this small side window.
* __Tabs__: Add two tabs so that we can switch between Maintenance Task widgets and Navigation Task widgets. Make the placement of the tabs proper.
* __Placement__: The widgets are still not placed uniformly in the GUI and it would be better if they are placed uniformly with no random spaces in the sides.
* __Camera Panel__: The Camera Panel widget takes too much space and it would be better if there were only three sliders and we choose via dropdown or some other method to select which camera we want to alter. This will reduce the widget size for putting other components.
* __Camera Feed__: A widget that will take camera feed from the webcameras and place it in the GUI. We will click on this to send the location for the arm to go autonomously to. 
* __Map Widget__: There are some problems with the Map widget, some of them being 'Follow Rover' button does not work. These issues mainly came when we ported from the Python-based GUI to React-based GUI.
* __Arm Info__: Some more arm information would be needed, like "Goal received", "Goal not reachable", "Distance from goal" and stuff like this. This is dependent on the final pipeline we decide for the competition, and this feature will keep getting changed during field testing.    

# Installation and Development

## Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or above)
- npm (comes with Node.js)

> __Note__: Make your own branch, DO NOT PUSH DIRECTLY TO react-devel branch. Start pull requests instead.

## Setup
Clone the repo and install dependencies:
```bash
git clone <repo-url>
cd <repo-folder>
npm install
```

## Running the GUI
```bash
npm run dev
```
This starts the Vite dev server, usually at `http://localhost:5173`. Open that in your browser. `Ctrl+Click` will open it in a new browser tab.

## Connecting to ROS2
Before opening the GUI, make sure rosbridge is running on the rover/laptop:
```bash
ros2 launch rosbridge_server rosbridge_websocket_launch.xml
```
This starts the websocket server at `ws://localhost:9090` by default, which is what `rosClient.js` connects to.

Once this is launched, you can see the ros2 topics being visualized in real time in the GUI.

# React + Vite
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler
The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration
If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.