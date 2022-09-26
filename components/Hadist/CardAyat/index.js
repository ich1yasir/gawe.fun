import { useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import exportAsImage from '../../../utils/exportDiv';
import styles from '../../../styles/Home.module.css'
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ContainerCard = styled('div')(({ theme }) => ({
    position: 'relative'
}));
const HadistCard = styled('div')(({ theme }) => ({
}));

const MenuCard = styled('div')(({ theme }) => ({
    position: 'absolute',
    top: '1rem',
    right: "0rem"
}));

const ITEM_HEIGHT = 48;

const MenuMore = (props) => {
    const options = [
        ['Export Image', () => {
            exportAsImage(props.exportRef.current, props.ayat.kitab + " - hadist")
            setAnchorEl(null);
        }],
        ['Copy Arabic', () => { 
            navigator.clipboard.writeText(props.ayat.arab) 
            setAnchorEl(null)
        }],
        ['Copy Terjemahan', () => { 
            navigator.clipboard.writeText(props.ayat.terjemah) 
            setAnchorEl(null);
        }]
    ];
    const [anchorEl, setAnchorEl] = useState();
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return <MenuCard>
        <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
        >
            <MoreVertIcon />
        </IconButton>
        <Menu
            id="long-menu"
            MenuListProps={{
                'aria-labelledby': 'long-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
                style: {
                    maxHeight: ITEM_HEIGHT * 4.5,
                    width: '20ch',
                },
            }}
        >
            {options.map((option) => (
                <MenuItem key={option[0]} selected={option === 'Export Image'} onClick={option[1]}>
                    {option}
                </MenuItem>
            ))}
        </Menu>
    </MenuCard>
}
const CardAyat = ({ ayat }) => {
    const exportRef = useRef();
    return <ContainerCard>
        <MenuMore exportRef={exportRef} ayat={ayat} />
        <HadistCard ref={exportRef} >
            <div className={styles.ayat}>
                <h3 className={styles.kitab}>{ayat.kitab}</h3>
                <p className={styles.arab}>{ayat.arab}</p>
                <p className={styles.terjemah}>{ayat.terjemah}</p>
            </div>
        </HadistCard>
    </ContainerCard>
}

export default CardAyat