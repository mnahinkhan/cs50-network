class ProfileTitle extends React.Component {
    render () {
        return(
            [<div key="profile-name-section" className="row profile-name-section">
                <div className="col-12">
                    <h3>{this.props.username}</h3>
                </div>
            </div>,
            <div key="follow-info-section" className="row follow-info-section">
                <div className="col-12">
                    <p>
                        <strong>
                            {this.props.follower_no}
                        </strong>
                        &ensp;follower{this.props.follower_no!==1 ? 's' : ''}  &ensp;|
                        &ensp;<strong>{this.props.following_no}</strong>
                        &ensp; following</p>
                </div>
            </div>
        ]
        )
    }
}

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
        const all_posts = posts.length > 0 ? posts.map(post => <Post text={post.content} key={post.id} author={post.author}
                                                       time={post.time_modified} likes={post.likes}
                                                                     color={post.color}/>) :
            <p id="no-following-message">
                Try following some people to see posts by them here!
            </p>;
        const editable_post = this.props.include_editable_post && <EditablePost username={this.props.editable_post_info.username}
                                                                          color={this.props.editable_post_info.color}/>;

        const profile_info = this.props.include_profile &&
            <ProfileTitle username={this.props.profile_info.username} follower_no={this.props.profile_info.follower_no}
                          following_no={this.props.profile_info.following_no}/>;
        return (
            <div className="container">
                {profile_info}
                {editable_post}
                {all_posts}
            </div>
        );
    }
}


function load_posts(which_posts) {
    // which_posts can be either "all" or a username or "following"
    // Am I loading another profile?
    const include_profile = which_posts !== "all" && which_posts !== "following";
    Promise.all(
        [
            fetch(`/posts/${which_posts}`).then(response=>response.json()),
            fetch('/get-username').then(response=>response.json()),
            include_profile && fetch(`/get-profile-info/${which_posts}`).then(response => response.json())
        ])
        .then(all_responses => {
        const [posts, editable_post_info, profile_info] = all_responses;
        console.log(profile_info);

        ReactDOM.render(<App posts={posts} // whichever posts need to be shown
                             include_editable_post={which_posts==="all" && editable_post_info.username!==""}
                             editable_post_info={editable_post_info} // in case "all", then this comes useful for editable post
                             include_profile={include_profile}
                             profile_info={profile_info} // If we are checking out a user's profile page
            />,
            document.querySelector("#app"));
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



