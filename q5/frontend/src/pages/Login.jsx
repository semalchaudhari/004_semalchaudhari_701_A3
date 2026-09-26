import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Login() {

    const [empid, setEmpid] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();


    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post('/login', {
                empid,
                password
            });


            localStorage.setItem(
                'token',
                response.data.token
            );


            navigate('/home');


        } catch (error) {

            alert(
                error.response?.data?.message ||
                'Login failed'
            );

        }

    };


    return (

        <div>

            <h1>Employee Login</h1>

            <form onSubmit={handleLogin}>

                <input
                    type="text"
                    placeholder="Employee ID"
                    value={empid}
                    onChange={(e) =>
                        setEmpid(e.target.value)
                    }
                />

                <br /><br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                <br /><br />

                <button type="submit">
                    Login
                </button>

            </form>

        </div>

    );

}

export default Login;