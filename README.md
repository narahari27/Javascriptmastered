import React, { useContext, useEffect, useState } from 'react';
import { Button, ButtonGroup, Typography, Modal, Box, Link, IconButton, Badge } from '@mui/material';
import { useMsal } from '@azure/msal-react';
import { NodeContext } from "../NodeContext";
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AuthenticatedTemplate } from "@azure/msal-react";
import { AllowedContent, NotAllowedContent, RoleLayout } from './auth/RoleLayout';
import { logoutRequest } from '../AuthConfig';
import LanguageIcon from '@mui/icons-material/Language';


const modalNotes = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const Header = () => {
    const { instance } = useMsal();
    const [openNotes, setOpenNotes] = React.useState(false);
    const context = useContext(NodeContext);
    const [utcTime, setUtcTime] = useState("");

    // Function to update UTC time every second
        useEffect(() => {
            const updateTime = () => {
                const now = new Date();
                const hours = now.getUTCHours().toString().padStart(2, '0'); // Ensures 2-digit format
                const minutes = now.getUTCMinutes().toString().padStart(2, '0');
                setUtcTime(`${hours}:${minutes}`); // Format HH:MM
            };
        
            updateTime(); // Initial call
        
            // Align interval to the next minute
            const interval = setInterval(updateTime, 1000);
        
            return () => clearInterval(interval); // Cleanup on unmount
        }, []);
    

    const handleLogout = async () => {
        try {
            window?.localStorage?.setItem('isLoggedIn', 'false');
            window?.localStorage?.removeItem('loginTime');
            await instance.logoutRedirect();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    useEffect(() => {
        // Function to check if 12 hours have passed
        function checkTimeout(startTime) {
            var currentTime = new Date().getTime();
            var elapsedTime = currentTime - startTime;
            var twelveHoursInMillis = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
            return elapsedTime >= twelveHoursInMillis;
        }

        // Calculate remaining time until 12 hours mark
        function calculateRemainingTime(startTime) {
            var currentTime = new Date().getTime();
            var elapsedTime = currentTime - startTime;
            var twelveHoursInMillis = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
            var remainingTime = twelveHoursInMillis - elapsedTime;
            return remainingTime;
        }

        if (!window.localStorage.getItem('loginTime')) {
            window.localStorage.setItem('loginTime', new Date());
        }

        let startTime = new Date(window.localStorage.getItem('loginTime')) ? Number(new Date(window.localStorage.getItem('loginTime'))) : new Date().getTime(); // Record the starting time

        // Calculate remaining time
        let remainingTime = calculateRemainingTime(startTime);

        var interval = setTimeout(function checkTimeoutHandler() {
            if (checkTimeout(startTime)) {
                handleLogout();
            } else {
                remainingTime = calculateRemainingTime(startTime);
                interval = setTimeout(checkTimeoutHandler, remainingTime);
            }
        }, remainingTime);

        // const logoutTimeout = setTimeout(() => {   
        //     handleLogout();
        // }, 12 * 60 * 60 * 1000);

        // const logoutTimeout = setTimeout(() => {
        //     debugger    
        //     handleLogout();
        // }, 500);

        return () => clearTimeout(interval);
    }, []);

    useEffect(() => {
        const refreshTimeout = setTimeout(() => {
            window.location.reload();
        }, 1 * 60 * 60 * 1000);

        return () => clearTimeout(refreshTimeout);
    }, []);

    const handleOORClick = () => {
        let currentOOR = localStorage.getItem('oor');
        if(currentOOR && currentOOR ==='true'){
            localStorage.setItem('oor', 'false');
            context?.toggleOOR(false)
        }else {
            localStorage.setItem('oor', 'true')
            context?.toggleOOR(true)
        }
    }

    return (
        <header style={{
            backgroundColor: '#d6006e',
            height: '96px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#fff',
            padding: '0 24px',
        }}>
            <Typography style={{ fontSize: '28px', display: 'flex', alignItems: 'center' }} variant="h1">
                <img width={48} height={48} style={{ marginRight: '8px' }} src="/tlogo.png" alt="logo" />
                PACKET CORE MOBILITY NATIONAL HEATMAP
            </Typography>

            <Box style={{ display: 'flex', alignItems: 'center' }}>
                <LanguageIcon style={{ fontSize: '20px', color: '#fff', marginRight: '8px' }} />
                <Typography style={{ fontSize: '16px', color: '#fff' }}>
                     UTC Time: {utcTime} 
                     </Typography>
            </Box>

            {/* <AuthenticatedTemplate>
                <RoleLayout roles={["user_access", "dev_access"]}>
                    <AllowedContent> */}
                        <ButtonGroup>
                            {/* <Button onClick={() => { localStorage.setItem('upf_view', !context?.upfView); context?.toggleUPFView(!context?.upfView) }} style={{ color: '#fff', borderColor: '#fff', background: 'transparent' }}>{!context?.upfView ? 'UPF/SMF View' : 'Mobility Heatmap'}</Button> */}
                            <Button onClick={() => { context.setNotifications(!context?.notifications) }} style={{ color: '#fff', borderColor: '#fff' }}> {!context?.notifications ? <IconButton>
                                <Badge badgeContent={context?.alerts?.length} color="primary">
                                    <NotificationsIcon style={{ fontSize: '20px', color: '#fff' }} />
                                </Badge>
                            </IconButton> : <ArrowBackIcon style={{ fontSize: '20px' }} />} </Button>
                            <Button onClick={() => { window.location.reload(); }} style={{ color: '#fff', borderColor: '#fff' }}>RELOAD</Button>
                            {!context?.upfView &&
                                <Button onClick={handleOORClick} style={{ color: '#fff', borderColor: '#fff', background: context?.oor ? 'rgb(160, 0, 80)' : 'transparent' }}> OOR </Button>
                            }
                            <Button onClick={() => { setOpenNotes(true); }} style={{ color: '#fff', borderColor: '#fff' }}> HELP </Button>
                            <Button onClick={handleLogout} style={{ color: '#fff', borderColor: '#fff', }}> LOGOUT <LogoutIcon style={{ fontSize: '16px', marginLeft: '8px' }} /></Button>
                        </ButtonGroup>
                    {/* </AllowedContent>
                </RoleLayout>
            </AuthenticatedTemplate> */}
            <Modal
                open={openNotes}
                onClose={() => { setOpenNotes(false); }}
                aria-labelledby="notes-modal-title"
                aria-describedby="notes-modal-description"
            >
                <Box sx={modalNotes}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography sx={{ color: '#d6006e' }} id="notes-modal-title" variant="h6" component="h2">
                            Help
                        </Typography>
                        <IconButton sx={{ color: '#d6006e' }} onClick={() => { setOpenNotes(false); }}><CloseIcon /></IconButton>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                        <Typography id="notes-modal-title" variant="body">
                            Email To:
                        </Typography>
                        <Link sx={{ marginLeft: '8px' }} href="mailto:wco_app_support@t-mobile.com" target="_blank" rel="noopener noreferrer">
                            WCO APP SUPPORT
                        </Link>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                        <Typography id="notes-modal-title" variant="body">
                            Download -
                        </Typography>
                        <Link sx={{ marginLeft: '8px' }} href={'Packet Core Heatmap - User Guide_v.pdf'} download target="_blank">
                            Packet Core User Guide
                        </Link>
                    </div>

                </Box>
            </Modal>
        </header>
    );
};

export default Header;
