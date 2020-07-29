class EditablePost extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            current_time: get_current_time(),
            post_content: ""
        };
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({
                 current_time: get_current_time()
            })
        }, 1000)
    }

    typed = (event) => {
        this.setState({
            post_content: event.target.value
        });
    };

    submitPost() {
        const content = this.state.post_content;
        let data = new FormData();
        data.append('content', content);
        data.append('csrfmiddlewaretoken', csrf_token);

        fetch('/post', {
            method: 'POST',
            body: data,
            credentials: 'same-origin'
        })
            .then(response => response.json())
            .then(result => {
                if ("success" in result) {
                    // The email was sent successfully!
                    reload_posts();
                    this.setState({
                        post_content: ""
                    });
                }

                if ("error" in result) {
                    console.log(result);
                }

            })
            .catch(error => {
                // we hope this code is never executed, but who knows?
                console.log(error);
            });
    }



    render() {
        const styles = {backgroundColor: this.props.color};
        return(
            <div className="row">
                <div className="col-12 col-md-8 offset-md-2 post" style={styles}>
                    <div className="post-content container">
                        <div className="row post-info">
                            <div className="col-6 author">
                                <p><a href={`/view-posts/${this.props.username}/`} style={{color: this.props.color}}>
                                    <strong>{this.props.username}</strong></a> says:</p>

                            </div>
                            <div className="col-6 time">
                                <p>{this.state.current_time}</p>
                            </div>
                        </div>
                        <div className="row post-body">
                            <div className="col-12 post-content-editable">
                                <textarea placeholder="What are you thinking today? Type away!...." style={styles}
                                          value={this.state.post_content} onChange={this.typed}>

                                </textarea>
                            </div>
                        </div>
                        <div className="row post-submit">
                            <button type="submit" style={styles} onClick={this.submitPost.bind(this)}>
                                <span id="submit-button-text" style={{color: this.props.color}}>Post!</span>
                            </button>
                        </div>
                    </div>


                </div>
            </div>
        );

    }
}

class Post extends React.Component {

    render() {
        const styles={backgroundColor: this.props.color};
        return (
            <div className="row">
                <div className="col-12 col-md-8 offset-md-2 post" style={styles}>
                    <div className="post-content container">
                        <div className="row post-info">
                            <div className="col-6 author">
                                <p><a href={`/view-posts/${this.props.author}/`} style={{color: this.props.color}}>
                                    <strong>{this.props.author}</strong></a> says:</p>
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
                                <p><strong>{this.props.likes}</strong> like{this.props.likes!==1 ? 's' : '' }</p>
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
        const all_posts = posts.map(post => <Post text={post.content} key={post.id} author={post.author}
                                                       time={post.time_modified} likes={post.likes}
                                                       color={post.color}/>);
        const editable_post = this.props.username !== "" && <EditablePost username={this.props.username}
                                                                          color={this.props.user_color}/>;
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
            fetch('/get-username').then(response=>response.json())
        ])
        .then(all_responses => {
        const [posts, editable_post_info] = all_responses;
        const username = editable_post_info["username"];
        const color = editable_post_info["color"];
        ReactDOM.render(<App posts={posts} username={username} user_color={color}/>, document.querySelector("#app"));
    })
        .catch(error => {
            // error is likely due to seeking "following" posts when authentication cannot be verified
            console.log(error);
            // load all posts instead... but only if we weren't trying that already!
            if (which_posts !== "all") load_posts("all");
        });


    const page_title = which_posts==="all" ? "All posts" : which_posts==="following" ? "Posts by people you follow" : `Posts by ${which_posts}`;
    document.querySelector('title').innerHTML = `Social Network - ${page_title}`;



}


function get_current_time() {
    return new Date().toLocaleTimeString([], {month: 'short', day: 'numeric', hour: 'numeric',
        minute: '2-digit', second: '2-digit', timeZone: "Asia/Qatar"})
    // I have set the timezone to Qatar because I fear that Django is failing to get the local time and is defaulting
    // to using Qatar timezone.

}

function first_load() {
    load_posts(which_posts_to_load);
}

function reload_posts() {
    load_posts("all", true);
}

first_load();



