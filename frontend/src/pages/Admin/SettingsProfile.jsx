import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
    ProfileContainer,
    Content,
    ProfileContent,
    ProfileHeader,
    ProfileDetails,
    ProfileLabel,
    ProfileInfo,
    EditButton
} from "../../styles/SettingsProfileStyles";
const SettingsProfile = () =>{
    const [isOpen, setIsOpen] = useState(true);

    const teacherInfo = {
        name: "John Doe",
        email: "abc123@gmail.com",
        phone: "123-456-7890",
        address: "123 Main St, City, State",
        qualification: "Master's Degree"
    };

    return(
        <ProfileContainer>
            <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
            <Content isOpen={isOpen}>
                <ProfileContent>
                    <ProfileHeader>Profile Details</ProfileHeader>
                    <ProfileDetails>
                        <ProfileLabel>Name: </ProfileLabel>
                        <ProfileInfo>{teacherInfo.name}</ProfileInfo>

                        <ProfileLabel>Email: </ProfileLabel>
                        <ProfileInfo>{teacherInfo.email}</ProfileInfo>

                        <ProfileLabel>Phone: </ProfileLabel>
                        <ProfileInfo>{teacherInfo.phone}</ProfileInfo>

                        <ProfileLabel>Address: </ProfileLabel>
                        <ProfileInfo>{teacherInfo.address}</ProfileInfo>

                        <ProfileLabel>Qualification: </ProfileLabel>
                        <ProfileInfo>{teacherInfo.qualification}</ProfileInfo>
                    </ProfileDetails>
                    <EditButton>Edit Profile</EditButton>
                </ProfileContent>
            </Content>
        </ProfileContainer>
    )
}

export default SettingsProfile