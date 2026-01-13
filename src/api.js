import axios from "axios";



const URL = "http://redbeapi-bmere9etc3c8eva6.canadacentral-01.azurewebsites.net";



// get users 
export async function getUsers() {
    
    const res = await axios.get(`${URL}/users`);

    if (res.status === 200) {

        return res.data;

    }else {
        throw new Error("Could not fetch members");
    }
}




export async function getMembers(dataLimit, page) {
    
    const res = await axios.get(`${URL}/members?page=${page}&limit=${dataLimit}`);
    
    if (res.status === 200) {

        return res.data;

    } else {
        throw new Error("Could not fetch members");
    }
}



// calling axios to create member 

export async function createMember(member) {

    const response = await axios.post(`${URL}/members`, member)
    

    return response
}

// Update member status
export async function updateMemberStatus(uuid, update) {
    
    return axios.patch(`${URL}/members/${uuid}`, update)

}


// Update member information
export async function updateMemberInfo(uuid, update) {
    
    return axios.patch(`${URL}/members/member_update/${uuid}`, update)

}

//get a member
export async function getMemberDetail(uuid) {
    // console.log(uuid)
    
    const response = await axios.get(`${URL}/members/detail/${uuid}`)

    return response
}





// calling axios to create user
export async function createUser(user) {

    const response = await axios.post(`${URL}/users`, user)

    return response
}

// calling axios to create user
export async function createAdmin(user) {

    const response = await axios.post(`${URL}/users/admin`, user)

    return response
}





// login user 
export async function verifyUser(user) {

    const res = await axios.post(`${URL}/users/login`, user)
    
    if(res.data.success){

        return res.data.token

    } else {

        return
    }
}


// add welfare member 
export async function createWelfareMember(member) {

    const response = await axios.post(`${URL}/welfare`, member)
    

    return response
}


// get all walfare members
export async function getWelfareMember() {

    const response = await axios.get(`${URL}/welfare`)

    if (response.status === 200) {

        return response.data;

    }else {
        throw new Error("Could not fetch members");
    }
}

// get all households
export async function getHouseholds() {

    const response = await axios.get(`${URL}/household`)

    if (response.status === 200) {

        return response.data;

    }else {
        throw new Error("Could not fetch members");
    }
}


export async function getAttendance() {

    const response = await axios.get(`${URL}/attendance`)

    if (response.status === 200) {

        return response.data;

    }else {
        throw new Error("Could not fetch members");
    }
}


// attendance

export async function submitAttendees(records) {
    
    const res = await axios.patch(`${URL}/attendance`, records)

    return res
}



// send birthday emails 
export async function sendEmail(emailContent){
    
    const res = await axios.post(`${URL}/email`, emailContent)
    
    return res
}


// reset password link
export async function getResetLink(email){
    
    const res = await axios.post(`${URL}/users/reset-link`, email)
    return res

}

export async function changePassword(data, token){
    console.log("from api",data, token)
    const res = await axios.post(`${URL}/users/reset-password`, data, token)
    return res

}