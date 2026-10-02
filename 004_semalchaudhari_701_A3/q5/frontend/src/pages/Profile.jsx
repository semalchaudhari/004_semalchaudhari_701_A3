import { useEffect, useState } from 'react';
import api from '../api';

function Profile() {

    const [employee, setEmployee] = useState(null);


    useEffect(() => {

        const getProfile = async () => {

            try {

                const response = await api.get('/profile');

                setEmployee(response.data);

            } catch (error) {

                console.log(error);

            }

        };


        getProfile();

    }, []);


    if (!employee) {

        return <p>Loading...</p>;

    }


    return (

        <div>

            <h1>Employee Profile</h1>

            <p>
                <b>Employee ID:</b> {employee.empid}
            </p>

            <p>
                <b>Name:</b> {employee.name}
            </p>

            <p>
                <b>Email:</b> {employee.email}
            </p>

            <p>
                <b>Basic Salary:</b> {employee.basicSalary}
            </p>

            <p>
                <b>HRA:</b> {employee.hra}
            </p>

            <p>
                <b>DA:</b> {employee.da}
            </p>

            <p>
                <b>Gross Salary:</b> {employee.grossSalary}
            </p>

        </div>

    );

}

export default Profile;