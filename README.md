# GUI
GUI WITH INTGRATED ASTROBIO PANEL WITH VARIOUS FEATURES 


To run this safely

Terminal 1
clone react-dev
then cd react-dev
then npm install
then do : npm run dev

Terminal 2
cd react-dev
ros2 launch rosbridge_server rosbridge_websocket_launch.xml

Terminal 
cd backend_for_camera
python3 -m venv venv
source venv/bin/activate
then install all the pip dependencies:  pip install fastapi uvicorn pyyaml opencv-python aiortc numpy
then cd backend
then run: uvicorn app.main:app --reload
