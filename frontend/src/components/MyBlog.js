import React from "react"
import axios from 'axios'
import swal from 'sweetalert'
import { connect } from "react-redux"
import {Link} from 'react-router-dom'

class MyBlog extends React.Component{
    constructor(props){
        super(props)
        this.state={
            myBlogs : []
        }
    }

    fetch = () => {
        let local = localStorage.getItem("token")
        // console.log(JSON.parse(local))
        if(JSON.parse(local) != null){
            const token = {
                headers : {Authorization : "Bearer "+JSON.parse(local)}
            }
            axios.post('http://127.0.0.1:5000/myblogs',{},token).then
            (res =>
                this.setState({
                    myBlogs : res.data
                })
            ).catch(error => console.log(error))
        }
    }

    componentDidMount = () =>{
        this.fetch()
    }

    deleteBlog = (id) =>{
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                let local = localStorage.getItem("token")
                // console.log(JSON.parse(local))
                if(JSON.parse(local) != null){
                    const token = {
                        headers : {Authorization : "Bearer "+JSON.parse(local)}
                    }
                    axios.post('http://127.0.0.1:5000/deleteblog',{
                        "blog_id" : id
                    },token).then
                    (res =>
                         {
                        swal("Poof! Your imaginary file has been deleted!", {
                            icon: "success",
                          })
                        this.fetch()
                         }
                    ).catch(error => console.log(error))
                }
              
            } else {
              swal("Your imaginary file is safe!");
            }
          });
    }

    
            

    render()
    {
        return(
            <div>
                {this.props.isloggedIn ? (
                    <div>
                        {this.state.myBlogs.map(ele => {
                            return(
                                <div  className="card m-5">
                                    <h5 className="card-title mt-3 ml-3">{ele.blog.title}</h5>
                                    <div className="card-body">
                                        <p>Published On : {ele.blog.publish_date}</p>
                                        <div className="d-flex">
                                            <span className="badge badge-secondary ml-3 mb-3">{ele.category}</span>
                                        </div>
                                        <div className="card">
                                            <p className="card-text m-4">{ele.blog.blog_body}</p>
                                        </div>
                                    </div>
                                    <div className="ml-3 mb-1">
                                        <Link to={`/myblog/${ele.blog.blog_id}`}><button className="btn btn-secondary">Update</button></Link>
                                        <button className="btn btn-secondary ml-2" onClick={() =>  this.deleteBlog(ele.blog.blog_id)}>Delete</button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ):(
                    <div className="row justify-content-center">
                        <h1 className="text-center">Sign In/ Sign Up First</h1>
                    </div>
                )}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isloggedIn : state.isloggedIn
})



export default connect(mapStateToProps,null) (MyBlog)
