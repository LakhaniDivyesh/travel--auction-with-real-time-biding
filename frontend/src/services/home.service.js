import { fetchWrapper } from "../utils/fetch.wrapper";


export function userSignup(signupData) {
    return fetchWrapper.post(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_AUTH}signup`,signupData);
}

export function userLogin(loginData) {
    return fetchWrapper.post(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_AUTH}login`,loginData);
}


export function addVacationPackage(packageData) {
    return fetchWrapper.post(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_HOME}add-package`,packageData);
}

export function listingPackage(provider) {
    return fetchWrapper.post(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_HOME}listing-package`,{provider});
}

export function listingBids(package_id) {
    return fetchWrapper.post(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_HOME}listing-bids`,{'package_id':package_id});
}

export function placeBid(bidData) {
    return fetchWrapper.post(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_HOME}place-bid`,bidData);
}

export function listingMyBids() {
    return fetchWrapper.post(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_HOME}listing-my-bids`,{});
}

export function setProfile(profileData) {
    return fetchWrapper.post(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_AUTH}set-profile`,profileData);
}

export function getProfile() {
    return fetchWrapper.post(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_AUTH}listing-profile-details`,{});
}
