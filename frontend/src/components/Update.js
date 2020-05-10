import React from 'react'
import axios from 'axios'
import swal from 'sweetalert'
import {Link} from 'react-router-dom'

class Update extends React.Component{
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

    componentDidMount = () =>{
        let id = this.props.match.params.id
        // console.log(id)
        axios.post('http://127.0.0.1:5000/getblogonid',{
            "blog_id" : id
        }).then
        (res =>{
            this.setState({
                blog_title:res.data.title,
                blog_category:res.data.category_id,
                blog:res.data.blog_body
            })
        }).catch(error => console.log(error))

    }

    update = (e) =>{
        e.preventDefault()
        let blog_title = this.state.blog_title
        let blog_category = this.state.blog_category
        let blog = this.state.blog
        let id = this.props.match.params.id
        // console.log({
        //     "blog_title" : blog_title,
        //     "blog_category": blog_category,
        //     "blog": blog,
        //     "username": username
        // })
        let local = localStorage.getItem("token")

            if(JSON.parse(local) != null){
                const token = {
                    headers : {Authorization : "Bearer "+JSON.parse(local)}
                }
            axios.put('http://127.0.0.1:5000/updateBlog',{
                "title" : blog_title,
                "category_id": blog_category,
                "blog_body": blog,
                "blog_id": id
            },token).then
            (res =>{
                if(res.data.message === "Update Done"){
                    swal(res.data.message,"welcome","success")
                }
            }).catch(error => console.log(error))
        }

        this.setState({
            blog_category : "",
            blog_title : "",
            blog : ""
        })
    }

    render(){
        return (
            <div className="mt-5">
                <Link to="/myblog"><button className="btn btn-lg btn-secondary ml-4">Go Back</button></Link>
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
                    <h3 className="text-center">Update Your Blog body Below</h3>
                    <div className="card mx-5 mt-3">
                        <textarea rows="10" name="blog" value={this.state.blog} onChange={this.handleChange}>

                        </textarea>
                    </div>
                    <br></br>
                    <button className="btn btn-success m-3" onClick={this.update}>Update</button>
                </div>
                
            </div>
        )
    }
    
}
export default Update
