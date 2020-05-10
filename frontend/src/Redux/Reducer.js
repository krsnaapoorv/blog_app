import { LOGIN, SIGNOUT} from "./Action"

const initialState = {
    isloggedIn: false,
    user: ""
  }

const Reducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return { ...state,
                isloggedIn : action.payload.isloggedIn,
                user : action.payload.user
            }
        
        case SIGNOUT:
            return { ...state,
                isloggedIn : action.payload,
                user : ""
            }
        
        default:
            return state;
    }
}

export default Reducer
  