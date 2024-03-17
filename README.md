To install and use PLANIT yourself for your own applications or further modifications, this is a basic set-up guide.

The instructions below will get you up and running, and for testing functionality, a test event is inserted into the newly created database as part of this process.
The code for this event is 'TESTURL123'.



/////////////////////
INSTALLATION 
INSTRUCTIONS
/////////////////////

1. Download github repo / extract files to desired directory
2. Make sure you have the latest version of node.js and npm installed.
3. From command line in linux, enter:

sudo apt-get update

sudo apt-get install nodejs

sudo apt install npm

4. Navigate to directory with CMD line
5. type npm install to install required node modules
6. Make sure you have the latest version of MYSQL Server installed and have set up your root user, on linux you can do this via:

sudo apt-get update

sudo apt-get install mysql-server

7. Make sure your command line is situated in forum app directory.
8. open MYSQL cmd line, on linux this is: sudo mysql
9. Run createPLANIT.sql, this is done by typing: source createPLANIT.sql
10. Exit MYSQL command line
11. In forum directory run index,js, to do this enter: node index.js
12. Alternatively, use another node module for keeping your app running, like node.js forever

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////