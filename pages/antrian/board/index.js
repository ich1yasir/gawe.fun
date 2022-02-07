import * as React from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material';
import theme from '../../../components/theme';
import AntrianCard from '../../../components/card/AntrianCard';
import {
    AuthAction,
    withAuthUser,
    withAuthUserTokenSSR,
} from 'next-firebase-auth'
import AntrianAppBar from '../../../components/AppBar/AntrianAppBar';
import { collection, query, where, getDocs, getFirestore  } from "firebase/firestore";
import {
    useAuthUser
} from 'next-firebase-auth'


const BoardAppBar = () => {
    const AuthUser = useAuthUser()
    const [dataAntrian, setDataAntrian] = React.useState([]);
    const  loadData = () =>  {
        
        const db = getFirestore();
        const q = query(collection(db, "antrian"), where("createdBy", "==", AuthUser.id));
        console.log(AuthUser.id);
        getDocs(q).then((querySnapshot)=> {
            console.log(querySnapshot)
            var snapshotAntrian = []
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                snapshotAntrian.push(doc.data())
            });
            setDataAntrian(snapshotAntrian)
        });
    }

    const ListCardAntrian = ({ antrian, key }) => {
        return (<Grid item xs={12} sm={12} md={6} key={key}>
            <AntrianCard antrian={antrian}/>
        </Grid>)
    }

    React.useEffect(() => {
        loadData();
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <AntrianAppBar></AntrianAppBar>
            <Container maxWidth='xl' sx={{ padding: '1rem' }}>
                <Grid container spacing={2} >
                    {dataAntrian && dataAntrian.map(function (antrian, i) {
                        return <ListCardAntrian antrian={antrian} key={i}/>
                    })}
                    
                    <Grid item xs={12}>
                        <Button>
                            Load More
                        </Button>
                    </Grid>
                </Grid>

            </Container>
        </ThemeProvider>
    );
};


// Note that this is a higher-order function.
export const getServerSideProps = withAuthUserTokenSSR()()

export default withAuthUser({
    authPageURL: '/antrian',
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(BoardAppBar)