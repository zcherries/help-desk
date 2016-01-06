# Help Desk for Makersquare
Legacy Project

Our team's goal is to revamp Makersquare's current Help Desk application. Our solution aims to continue the tradition of having a simple UI for Help Requests (HRs). We believe that it should be easy for students to submit help requests. Fellows too should have a simple interface to manage these HRs, as well as to report any bugs found in the curriculum. We balance the desire to provide users with a convenient, fast way to submit HRs with another desire, which is to collect useful information from our users with which we can provide the Makersquare administration.

###Start me up!

```
# from the project root directory...
$ mongod
$ npm start
```

####Some Notes:
The server has a built-in middleware that prints request information as it comes in. This is useful for debugging, so be vigilant, and remember to defer to the terminal in which nodemon is running.

Tech Stack

We use Babel to transpile ES6 and JSX code. For development purposes, we recommend using an in-browser transpiler offered by a CDN. But for production, we recommend precompiling your code prior to deploying.

####Front-End:
ReactJS
jQuery
Bootstrap

####Back-End:
Node.js
Express
Socket.io
MongoDB
Mongoose (ODM)

####Utilities:
Webpack -- javascript file bundling (please read this Webpack tutorial by one of React's lead engineers, Pete Hunt, espousing the benefits of Webpack within the React workflow. https://github.com/petehunt/webpack-howto)
Grunt / Gulp / Shell Files for ease-of-build

####Further Notes:
Please .gitignore your node_modules and bower_components. We do not want to clutter our repo. This will bottleneck the download/upload processes.

Down the road, we would like to implement React-Router (https://www.npmjs.com/package/react-router), an npm module that synchronizes your URL with your views. This is desirable for cohesion between views, browser history, and URLs -- ultimate cohesion.

More to come later...
