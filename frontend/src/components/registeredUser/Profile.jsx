import React, { useState, useEffect } from 'react'
import SkillCard from './components/SkillCard'
import { tokenAxios } from '../api'
import SocialLinkCard from './components/SocialLinkCard';
import EducationCard from './components/EducationCard';
import VacancyCard from './components/VacancyCard';
const Profile = () => {


    const [userBasicDetails, setUserBasicDetails] = useState({})
    const [userFullDetails, setUserFullDetails] = useState({})
    const [userEducation, setUserEducation] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        tokenAxios.get(`/user/me`)
            .then(response => {
                setUserBasicDetails(response.data)
                return (response.data._id)
            })
            .then(id => {
                tokenAxios.get(`/user/${id}`)
                    .then(response => {

                        setUserFullDetails(response.data)
                        console.log(response.data)
                        setUserEducation({ education: response.data.education })
                        setIsLoading(false)

                    })
                //todo:tell user about the error
            }).catch((error) => console.log(error))

    }, [])
    const getUserDetails = () => {
        return userFullDetails.dp
    }
    const getSkills = () => {
        return userFullDetails.skills
    }
    const getLinks = () => {
        return userFullDetails.links
    }
    const getEducation = () => {
        return userFullDetails.education
    }
    // const userDpUrl = getUserDetails()
    // console.log(userDpUrl)
    // const userDpName = userDpUrl.split('/').pop()
    const getDpName = (url) => {
        console.log(url.split("\\"))
        return url.split('\\').pop()
    }

    return (
        isLoading ?
            'loading...'
            :
            (<>
                <div className="container-fluid bg-white p-4  mb-4 shadow rounded">
                    <div className="d-flex flex-column flex-sm-row">
                        <div className="rounded-circle align-self-center mx-2 mx-xl-5" style={{ backgroundImage: `url("http://localhost:8000/dp/${getDpName(userFullDetails.dp)}")`, backgroundSize: 'cover', height: '20vh', width: '20vh' }}>
                        </div>
                        <div className="mx-4 d-flex justify-content-between flex-column">
                            <h2>{userFullDetails.name}</h2>
                            <pre>
                                {userFullDetails.bio}
                                {/* cake murder @18nov<br />
                            developer<br />
                            Nitian<br /> */}
                            </pre>
                            <p><strong>connections:</strong> {userFullDetails.connectionCount}</p>
                            <div className="d-flex">
                                <button className="btn btn-outline-primary">connect</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-sm-12 col-xl-6 ">
                    {/* {console.log(userFullDetails.skills)} */}
                    <SkillCard skills={getSkills} />
                </div>
                <div className="col-sm-12 col-xl-6 ">
                    {/* {console.log(userFullDetails.skills)} */}
                    <SocialLinkCard links={getLinks} />
                </div>
                <div className="col-12 ">
                    {/* {console.log(userFullDetails.skills)} */}
                    {/* {!isLoading && <EducationCard details={getEducation} isLoading={isLoading} />} */}
                    <EducationCard details={getEducation} />
                </div>
                <div className="col-12 ">
                    {/* {console.log(userFullDetails.skills)} */}
                    {/* {!isLoading && <EducationCard details={getEducation} isLoading={isLoading} />} */}
                    <VacancyCard details={getEducation} />
                </div>
            </>)




    )


}


export default Profile
