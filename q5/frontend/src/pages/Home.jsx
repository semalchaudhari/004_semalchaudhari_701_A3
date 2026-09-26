import { Link, useNavigate } from 'react-router-dom';

function Home() {

    const navigate = useNavigate();


    const logout = () => {

        localStorage.removeItem('token');

        navigate('/');

    };


    return (

        <div>

            <h1>Employee Home</h1>

            <ul>

                <li>
                    <Link to="/profile">
                        Page 1 - Employee Profile
                    </Link>
                </li>

                <li>
                    <Link to="/leave">
                        Page 2 - Application for Leave
                    </Link>
                </li>

                <li>
                    <button onClick={logout}>
                        Logout
                    </button>
                </li>

            </ul>

        </div>

    );

}

export default Home;