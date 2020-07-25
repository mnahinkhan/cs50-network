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
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        };
    }

    render() {
        const posts = this.props.posts;
        console.log(posts);
        const all_posts = posts.map((post, i) => <Post text={post.content} key={post.id} author={post.author} time={post.time_modified} likes={post.likes}/>);
        const editable_post = <h2>Hey!</h2>;
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
    fetch(`/posts/${which_posts}`)
        .then(response => response.json())
        .then(posts => {
                ReactDOM.render(<App posts={posts}/>, document.querySelector("#app"));
            }
        )
        .catch(error => {
            // error is likely due to seeking "following" posts when authentication cannot be verified
            console.log(error);
            // load all posts instead... but only if we weren't trying that already!
            if (which_posts !== "all") load_posts("all");
        });

}

load_posts("all");