# cs50-network
A project for a social-media website,  implementing both backend and frontend

For Youtube intro see: https://youtu.be/7jb8t-xCJc0

For this project the frontnend was coded using mainly ReactJS and the backend was made using Django.

index.jsx file has most of the client side code, and views.py and urls.py has most of the relevant server side logic (along with models.py, which defines how data is stored in the server database).


When a page is requested, Django serves up a mostly empty webpage to the client (apart from the layout). The webpage simply executes the javascript code in index.jsx.

In index.jsx, we use components to represent various elements like posts, profile titles, pagination nav bar, etc. A function called load_posts() is used to load the posts. The function takes as an argumnet the relavant parameters for exactly what should be loaded, which is the only information Django provides to the index.html page. The load_posts() function then deals with fetching the needed data from the server and so on (the server side logic is of course also coded in views.py).

The styling is done in styles.scss (compiled to css) as usual.


