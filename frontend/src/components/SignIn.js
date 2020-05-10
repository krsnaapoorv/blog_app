import React from 'react'
import axios from 'axios'
import swal from 'sweetalert'
import {Link} from 'react-router-dom'
import {login} from '../Redux/Action'
import { connect } from "react-redux"

class SignIn extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            email : "",
            password : ""
        }
    }

    handleChange=(event)=>{
        this.setState({
            [event.target.name]: event.target.value
        });
      }

    handleClick = (e) =>{
    e.preventDefault()
    let email = this.state.email
    let password = this.state.password
    axios.post('http://127.0.0.1:5000/auth/signin',{
            "email" : email,
            "password" : password
        }).then
        (res =>{
            // console.log(res)
            if(res.data.message === "Login Successful"){
                localStorage.setItem("token",JSON.stringify(res.data.token))
                localStorage.setItem("isLoggedIn",true)
                localStorage.setItem("user",res.data.username)
                this.props.login({"isloggedIn":true,"user":res.data.username})
                swal(res.data.message,"welcome","success")
                
            }
            else if(res.data.message === "Email Doesn't Exist"){
                swal(res.data.message,"Make Account","error")
            }
            else if(res.data.message === "Wrong Credentials"){
                swal(res.data.message,"try again","error")
            }
            else{
                localStorage.removeItem("token")
                localStorage.removeItem("isLoggedIn")
                localStorage.setItem("isLoggedIn",false)
                swal(res.data,"try again","error")
            }
            
        }).catch(error => swal(error))

        this.setState({
            email : "",
            password : ""
        })
    }

    render(){
        console.log(this.props.isloggedIn)
        return (
            <div>
               {this.props.isloggedIn ? (
                   <div>
                       <h1 className="text-center">Already Logged In</h1>
                       <Link to="/details" className = " m-5 btn btn-info">Details</Link>
                    </div>
               ):(
                   <div>
                        
                        <div className="bgLogin mt-5">
                            <h3 className="text-center mt-1">SignIn Form</h3>
                            <div className="mx-3">
                                <label className="ml-1 mt-2">Email</label>
                                <input className="form-control" onChange={this.handleChange} type="email" value={this.state.email} name="email" placeholder="Enter email" />
                            </div>
                            <div className="mx-3">
                                <label className="ml-1 mt-2">Password</label>
                                <input className="form-control" onChange={this.handleChange} type="password" value={this.state.password} name="password" placeholder="Enter password" />
                            </div>
                            <button className="btn btn-primary mt-3 ml-3 mb-3" onClick={this.handleClick}>Sign In</button>
                            <Link to="/signup" className = " ml-1 btn btn-info">Don't have an account? Signup</Link>
                        </div>
                    </div>
                
               )}
            </div>
        )
    }
    
}

 
const mapStateToProps = state => ({
    isloggedIn : state.isloggedIn
});

const mapDispatchToProps = dispatch => ({
    login: payload => dispatch(login(payload)),
});
  
export default connect(mapStateToProps,mapDispatchToProps) (SignIn)
