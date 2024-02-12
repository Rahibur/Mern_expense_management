// import important dependencies 
import React,{useState,useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { message } from 'antd';
// arrow function
const Header = () => {
    const [loginUser,setLoginUser]=useState('');
    const navigate = useNavigate();
    // display login user name
    useEffect(()=>{
        const user = JSON.parse (localStorage.getItem('user'))
        if(user){
            setLoginUser(user)
        }
    },[])
// logout functionality
    const logoutHandler = ()=>{
        localStorage.removeItem("user");
        message.success('You are logged out');
        navigate('/login')
    }
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">INVENTORY</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                               <p className="nav-link">{loginUser && loginUser.name}</p>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-primary"
                                onClick={logoutHandler}>
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>


        </>
    );
};

export default Header;