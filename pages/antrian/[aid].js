import * as React from 'react';
import PropTypes from 'prop-types';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles';
import {
    AuthAction,
    withAuthUser,
    withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { AppBar, Box, Button, ButtonBase, ThemeProvider, Typography } from '@mui/material';
import theme from '../../components/theme';
import { getAntrianSubcribtion, openAntrian, closeAntrian, getWaitingListSubscription, getActiveList, getPassedList } from '../../utils/DLAntrian';
import COMPANY_LIST from '../../utils/companyTypeList';
import STATUS_ANTRIAN from '../../utils/statusAntrian';
import InputAntrianForm from '../../components/Form/InputAntrianForm';
import LoaderAntrian from '../../components/loader';
import QRCode from 'react-qr-code';
import AntrianList from '../../components/AntrianList';
import CssBaseline from '@mui/material/CssBaseline';
import { Home } from '@mui/icons-material';

const drawerWidth = 400;
const qrWidth = drawerWidth - 32;



const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
});

function Antrian(props) {

    const router = useRouter()
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const [active, setActive] = React.useState([0, 1, 2]);
    const { aid } = router.query
    const [dataAntrian, setDataAntrian] = React.useState(null);
    const [waitingList, setWaitingList] = React.useState(null);
    const [activeList, setActiveList] = React.useState(null);
    const [passedList, setPassedList] = React.useState(null);
    var unSub = null;
    var unSubWaitingList = null;
    var unSubActiveList = null;
    var unSubPassedList = null;

    const onChangeAntrian = (docSnap) => {
        setDataAntrian(docSnap.data())
    }
    const onChangeWaitingList = (querySnapshot) => {
        const listWaiting = [];
        querySnapshot.forEach((doc) => {
            listWaiting.push({
                'id': doc.id,
                'data': doc.data()
            });
        });
        console.log(waitingList)
        setWaitingList(listWaiting)
    }
    const onChangeActiveList = (docSnap) => {
        setDataAntrian(docSnap.data())
    }
    const onChangePassedList = (docSnap) => {
        setDataAntrian(docSnap.data())
    }

    const loadData = () => {
        getAntrianSubcribtion(aid, onChangeAntrian).then((unsub) => {
            unSub = unsub
        })
        getWaitingListSubscription(aid, onChangeWaitingList).then((unsub) => {
            unSubWaitingList = unsub
        })
        getActiveList(aid).then((d) => {
            setActiveList(d)
        })

        getPassedList(aid).then((d) => {
            setPassedList(d)
        })
    }

    const openAction = () => {
        openAntrian(aid)
    }

    const closeAction = () => {
        closeAntrian(aid)
    }


    React.useEffect(() => {
        console.log("subscribe: ", aid);
        loadData();
    }, []);

    React.useEffect(() => {
        return () => {
            if (unSub) {
                console.log("unsubscibe: ", aid);
                unSub();
            }
        };
    }, []);


    const drawer = (
        dataAntrian && <Box sx={{p: '1rem'}}>
            <ButtonBase sx={{ width: qrWidth }}>
                {dataAntrian.accessCode ?
                    <QRCode value={`https://gawe.fun/antrian/comm/${aid}${dataAntrian.accessCode}`} size={qrWidth}></QRCode>
                    :
                    <Img alt="complex" src="/ticket-icon.svg" />}
            </ButtonBase>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginY: '1rem'
                }}
            >
                {
                    dataAntrian.status == 1 ? <Button onClick={closeAction} variant="outlined">CLOSE ANTRIAN</Button> :
                        <Button onClick={openAction} variant="outlined">OPEN ANTRIAN</Button>
                }
            </Box>

            <Typography variant="body1" textAlign='start' color="text.primary">
                STATUS: {STATUS_ANTRIAN[dataAntrian.status] || 'Close'} 
            </Typography>
            <Typography variant="body2" textAlign='start' color="text.secondary">
                (AC: {dataAntrian.accessCode})
            </Typography>

            <Divider sx={{marginY: '1rem'}}/>
            <InputAntrianForm
                TYPE={0}
                VAL={dataAntrian.name}
                ID='name'
                LAB='Name'
                MAP='name'
                AID={aid}
                REQ={true} />
            <InputAntrianForm
                TYPE={0}
                VAL={dataAntrian.address}
                ID='address'
                LAB='Alamat'
                MAP='address'
                AID={aid}
                REQ={true} />
            <InputAntrianForm
                TYPE={0}
                VAL={dataAntrian.prefixCode}
                ID='prefixCode'
                LAB='Prefix Code'
                MAP='prefixCode'
                AID={aid}
                REQ={true} />
            <Typography variant="body2" textAlign='start' color="text.secondary">
                CODE: {dataAntrian.prefixCode || 'ANTRI'}-00XXXX
            </Typography>

            <InputAntrianForm
                TYPE={1}
                VAL={dataAntrian.company}
                ID='company'
                LAB='Company'
                MAP='company'
                AID={aid}
                REQ={true}
                OPTIONS={COMPANY_LIST} />

        </Box>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (<ThemeProvider theme={theme} sx={{ overflow: "hidden" }}>
        {
            dataAntrian ?
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar
                    position="fixed"
                    sx={{
                        width: { md: `calc(100% - ${drawerWidth}px)` },
                        ml: { md: `${drawerWidth}px` },
                    }}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { md: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={() => router.push('/antrian/board')}
                            sx={{ mr: 2}}>
                                <Home/>
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            Antrian Management
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Box
                    component="nav"
                    sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
                    aria-label="mailbox folders"
                >
                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                    <Drawer
                        container={container}
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        sx={{
                            display: { xs: 'block', md: 'none' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                    >
                        {drawer}
                    </Drawer>
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: { xs: 'none', md: 'block' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                        open
                    >
                        {drawer}
                    </Drawer>
                </Box>
                <Box
                    component="main"
                    sx={{ flexGrow: 1, p: 1, width: { md: `calc(100% - ${drawerWidth}px)` } }}
                >
                    <Toolbar />
                    <AntrianList items={waitingList}  title={dataAntrian.name} index={1}>

                    </AntrianList>
                </Box>
            </Box> 
            :
            <LoaderAntrian></LoaderAntrian>
        }
    </ThemeProvider>
    );
}

Antrian.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

// Note that this is a higher-order function.
export const getServerSideProps = withAuthUserTokenSSR()()

export default withAuthUser({
    authPageURL: '/antrian',
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Antrian)



