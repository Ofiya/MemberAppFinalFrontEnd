// import { useState, useEffect } from 'react';
// import axios from 'axios';


// const BASE_URL = "http://localhost:3000"


// export function useFetchData(url) {

//         const [data, setData] = useState(null);
//         const [loading, setLoading] = useState(true);
//         const [error, setError] = useState(null);


//         useEffect(() => {

//             const fetchData = async () => {

//                 try {

//                     const response = await axios.get(`${BASE_URL}${url}`);

//                     setData(response.data);

//                 } catch (e) {

//                     setError(e);

//                 } finally {

//                     setLoading(false);

//                 }

//             };

//             fetchData();

//         }, [url]); 

//         return { data, loading, error };

// }