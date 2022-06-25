import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RoomHeaderOpenOptionsContainer from './RoomHeaderOptionsContainer';
import MenuIcon from '@mui/icons-material/Menu';

const RoomHeaderOptions = ({socket,Rooms}) =>{
  console.log("props are Rooms and Socket->",Rooms,socket);
  const [SelectedOption,setSelectedOption] = React.useState("None");
const options = [
  'None',
  'Add Room',
  'Delete Chat & Room'
];
var RoomsList =Rooms;
console.log("Rooms List in Room Header Options is ",RoomsList);
const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open , setOpen] = React.useState();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    console.log("Selected option is ",event);
    setOpen(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
  setOpen(false);
  };

  React.useEffect(()=>{
    window.addEventListener('click',function(){
        
    });

    return()=>{
      window.removeEventListener('click',function(){
        console.log("Removed");
      });
    }
   },[])

console.log("In Room Header Options->");
console.log("Room Header Rooms->",Rooms);

  return (
    <div>
    <div>
      <IconButton
        aria-label="more"
        id="RoomHeader-OptionsMenu-Icon"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        
        <MenuIcon />
     
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
          <MenuItem key={option} selected={option === anchorEl} onClick={()=>{setSelectedOption(option); setOpen(false);}}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
    <RoomHeaderOpenOptionsContainer  SelectedOption={SelectedOption}  Rooms={RoomsList}   socket={socket} />
    </div>

    


  );
}

export default RoomHeaderOptions;