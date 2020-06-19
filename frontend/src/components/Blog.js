import React from "react"
import axios from 'axios'
import swal from 'sweetalert'

class Blog extends React.Component{
    constructor(props){
        super(props)
        this.state={
            blog : [],
            comment : [],
            openComments : false,
            addComment : "",
            blog_id : 0
        }
    }
    componentDidMount= () => {
        axios.get('http://127.0.0.1:5000/blog')
        .then (res =>{
            // console.log(res.data)
            this.setState({
                blog : res.data
            })
        }).catch(error => console.log(error))
        
      }
    handleChange = (event) =>{
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    addComment = (id) => {
        let username = localStorage.getItem('user')
        let comment = this.state.addComment
        let blog_id = id
        axios.post('http://127.0.0.1:5000/addcomment',{
            "username" : username,
            "comment" : comment,
            "blog_id" : blog_id
        })
        .then (res =>{
            swal(res.data.message,"welcome","success")
            this.showComments(id)
        }).catch(error => console.log(error))
        this.setState({
            addComment : ""
        })
    }

    showComments = (id) =>{
        this.setState({
            openComments: true,
            blog_id : id
        })
        axios.post('http://127.0.0.1:5000/comments',{
            "blog_id" : id
        })
        .then (res =>{
            console.log(res.data)
            this.setState({
                comment : res.data
            })
        }).catch(error => console.log(error))
    }

    render(){
        return (
            <div>
                {this.state.blog.map(ele => 
                    <>
                        <div className="card m-5">
                            <h5 className="card-title mt-3 ml-3">{ele.blog.title}</h5>
                            <div className="card-body">
                                <p>Last Updated On : {ele.blog.update_date}</p>
                                <div className="d-flex">
                                    
                                    <span className="badge badge-secondary ml-3 mb-3">{ele.category}</span>
                                    <span className="badge badge-secondary ml-3 mb-3">by {ele.username}</span>
                                </div>
                                <div className="card">
                                    <p className="card-text m-4">{ele.blog.blog_body}</p>
                                </div>
                            </div>
                            
                            <div className="ml-3 mb-1">
                                <button className="btn btn-secondary" onClick={() =>  this.showComments(ele.blog.blog_id)}>Show Comments</button>
                            </div>
                            {this.state.openComments && (this.state.blog_id == ele.blog.blog_id) ? (
                                <div className="card mx-3 mt-1">
                                    {this.state.comment.map(item =>{
                                        return(
                                            <div className="m-1">
                                                <h5 className="font-wight-bold">{item.username}</h5>
                                                <p className="ml-2 float-left">{item.comment.comment}</p>
                                                <small className="ml-2">{item.comment.comment_date}</small>
                                            </div>
                                        )       
                                    })}
                                    <div className="m-3  row">
                                    <div className="col-md-4">
                                        <input className="form-control" placeholder="Comment here" name="addComment" value={this.state.addComment} onChange={this.handleChange}></input>
                                    </div>
                                    <button className="btn btn-sm btn-primary" onClick={() =>  this.addComment(ele.blog.blog_id)}>Comment</button>
                            </div>
                                </div>
                            ):(
                                <div></div>
                            )}
                        </div>
                        
                    </>
                    )}
            </div>
            
        )
    }
    
}

export default Blog

