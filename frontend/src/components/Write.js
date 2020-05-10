import React from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'

class Write extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            blog_category : "",
            blog_title : "",
            blog : ""
        }
    }

    handleChange = (event) =>{
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    publish = (e) =>{
        e.preventDefault()
        let blog_title = this.state.blog_title
        let blog_category = this.state.blog_category
        let blog = this.state.blog
        let username = localStorage.getItem('user')
        // console.log({
        //     "blog_title" : blog_title,
        //     "blog_category": blog_category,
        //     "blog": blog,
        //     "username": username
        // })
        axios.post('http://127.0.0.1:5000/writeBlogs',{
            "title" : blog_title,
            "category_id": blog_category,
            "blog_body": blog,
            "username": username
        }).then
        (res =>{
            if(res.data.message === "Blog Created"){
                swal(res.data.message,"welcome","success")
            }
        }).catch(error => console.log(error))

        this.setState({
            blog_category : "",
            blog_title : "",
            blog : ""
        })
    }

    render(){
        return (
            this.props.isloggedIn ? 
            (
            <div className="mt-5">
                <div className=" m-5  card">
                    <div className="input-group mb-3 m-5 w-25">
                        <div className="input-group-prepend">
                            <label className="input-group-text" for="inputGroupSelect01">Blog Category</label>
                        </div>
                        <select className="custom-select" id="inputGroupSelect01" name="blog_category" value={this.state.blog_category} onChange={this.handleChange} >
                            <option defaultValue>Choose...</option>
                            <option value="1">Programming</option>
                            <option value="2">Environment</option>
                            <option value="3">Science and Technology</option>
                            <option value="4">Economics</option>
                        </select>
                    </div>
                    <div className="input-group mb-2 mx-5 ">
                        <div className="input-group-prepend ">
                            <label className="input-group-text" for="inputGroupSelect01">Upload Images</label>
                        </div>
                        <div className="ml-2 ">
                            <input className="form-contol" name="image" type="file" />
                        </div>
                    </div>
                    <div className="ml-5 row">
                        <div className="col-md-2">
                            <label className="input-group-text">Blog Title</label>
                        </div>
                        <div className="col-md-2">
                            <input className="form-control" placeholder="Enter Title for Blog" name="blog_title" value={this.state.blog_title} onChange={this.handleChange}></input>
                        </div>
                    </div>
                    <h3 className="text-center">Write Your Blog Below</h3>
                    <div className="card mx-5 mt-3">
                        <textarea rows="10" name="blog" value={this.state.blog} onChange={this.handleChange}>

                        </textarea>
                    </div>
                    <br></br>
                    <button className="btn btn-success m-3" onClick={this.publish}>Publish</button>
                </div>
                
            </div>
            ):
            (
                <div className="text-center">Sign In First</div>
            )
        )
    }
    
}

const mapStateToProps = state => ({
    isloggedIn : state.isloggedIn
}) 
export default connect(mapStateToProps,null) (Write)
