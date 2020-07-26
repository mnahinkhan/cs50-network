class EditablePost extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            current_time: get_current_time()
        };
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({
                 current_time: get_current_time()
            })
        }, 1000)
    }

    render() {
        return(
            <div className="row">
                <div className="col-12 col-md-8 offset-md-2 post">
                    <div className="post-content container">
                        <div className="row post-info">
                            <div className="col-6 author">
                                <p><strong>{this.props.username}</strong> says:</p>
                            </div>
                            <div className="col-6 time">
                                <p>{this.state.current_time}</p>
                            </div>
                        </div>
                        <div className="row post-body">
                            <div className="col-12 post-content">
                                <p>{this.props.text}</p>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        );

    }
}

class Post extends React.Component {
    render() {
        return (
            <div className="row">
                <div className="col-12 col-md-8 offset-md-2 post">
                    <div className="post-content container">
                        <div className="row post-info">
                            <div className="col-6 author">
                                <p><strong>{this.props.author}</strong> says:</p>
                            </div>
                            <div className="col-6 time">
                                <p>{this.props.time}</p>
                            </div>
                        </div>
                        <div className="row post-body">
                            <div className="col-12 post-content">
                                <p>{this.props.text}</p>
                            </div>
                        </div>
                        <div className="row post-likes">
                            <div className="col-12">
                                {/*    insert heart symbol here*/}
                                <p><strong>{this.props.likes}</strong> likes</p>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        );
    }
}

class App extends React.Component {


    render() {
        const posts = this.props.posts;
        console.log(posts);
        const all_posts = posts.map((post, i) => <Post text={post.content} key={post.id} author={post.author}
                                                       time={post.time_modified} likes={post.likes}/>);
        const editable_post = this.props.username === "" ? null : <EditablePost username={this.props.username}/>;
        return (
            <div className="container">
                {editable_post}
                {all_posts}
            </div>
        );
    }
}


function load_posts(which_posts) {
    // which_posts can be either "all" or a username or "following"
    Promise.all(
        [
            fetch(`/posts/${which_posts}`).then(response=>response.json()),
            fetch('get-username').then(response=>response.json()).then(username_object => username_object["username"])
        ])
        .then(all_responses => {
        const [posts, username] = all_responses;
        console.log(posts);
        console.log(username);
        ReactDOM.render(<App posts={posts} username={username}/>, document.querySelector("#app"));
    })
        .catch(error => {
            // error is likely due to seeking "following" posts when authentication cannot be verified
            console.log(error);
            // load all posts instead... but only if we weren't trying that already!
            if (which_posts !== "all") load_posts("all");
        });

}

function get_current_time() {
    return new Date().toLocaleTimeString([], {month: 'short', day: 'numeric', hour: 'numeric',
        minute: '2-digit', second: '2-digit', timeZone: "Asia/Qatar"})
    // I have set the timezone to Qatar because I fear that Django is failing to get the local time and is defaulting
    // to using Qatar timezone.

}
load_posts("all");