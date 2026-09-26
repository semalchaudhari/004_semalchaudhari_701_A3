import { useEffect, useState } from 'react';
import api from '../api';

function Leave() {

    const [date, setDate] = useState('');
    const [reason, setReason] = useState('');

    const [leaves, setLeaves] = useState([]);


    const loadLeaves = async () => {

        try {

            const response = await api.get('/leaves');

            setLeaves(response.data);

        } catch (error) {

            console.log(error);

        }

    };


    useEffect(() => {

        loadLeaves();

    }, []);


    const applyLeave = async (e) => {

        e.preventDefault();

        try {

            await api.post('/leaves', {
                date,
                reason
            });


            alert('Leave application submitted');

            setDate('');
            setReason('');

            loadLeaves();


        } catch (error) {

            alert('Unable to apply for leave');

        }

    };


    return (

        <div>

            <h1>Application for Leave</h1>


            <form onSubmit={applyLeave}>

                <label>
                    Date:
                </label>

                <input
                    type="date"
                    value={date}
                    onChange={(e) =>
                        setDate(e.target.value)
                    }
                    required
                />

                <br /><br />


                <label>
                    Reason:
                </label>

                <textarea
                    value={reason}
                    onChange={(e) =>
                        setReason(e.target.value)
                    }
                    required
                />

                <br /><br />


                <button type="submit">
                    Apply Leave
                </button>

            </form>


            <hr />


            <h2>My Leave Applications</h2>


            <table border="1" cellPadding="8">

                <thead>

                    <tr>
                        <th>Date</th>
                        <th>Reason</th>
                        <th>Grant</th>
                    </tr>

                </thead>


                <tbody>

                    {leaves.map((leave) => (

                        <tr key={leave._id}>

                            <td>
                                {new Date(
                                    leave.date
                                ).toLocaleDateString()}
                            </td>

                            <td>
                                {leave.reason}
                            </td>

                            <td>
                                {leave.grant}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

export default Leave;