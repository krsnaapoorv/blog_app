import React from 'react'
import axios from 'axios'

class Details extends React.Component{
    constructor(props){
        super(props)
        this.state={
            name : "",
            email : "",
            avtar : "",
            mobile : "",
            about : ""
        }
    }

    componentDidMount=() =>{
        let local = localStorage.getItem("token")
        console.log(JSON.parse(local))
        if(JSON.parse(local) != null){
            const token = {
                headers : {Authorization : "Bearer "+JSON.parse(local)}
            }
            axios.post('http://127.0.0.1:5000/read',{},token).then
            (res =>
                this.setState({
                    name : res.data.name,
                    email : res.data.email,
                    mobile : res.data.mobile,
                    about : res.data.about
                })
            ).catch(error => console.log(error))
        }
        
    }

    render()
    {
        return (
            <div>
                <h1 className="text-center"> Hello {this.state.name}</h1>
                <h1 className="text-center"> email:{this.state.email}</h1>
                <h1 className="text-center"> mobile:{this.state.mobile}</h1>
                <h1 className="text-center"> about:{this.state.about}</h1>
            </div>
        )
    }
    
}

export default Details
