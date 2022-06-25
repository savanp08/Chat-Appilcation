import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatWindowOptionsContainer from './ChatWindowOptionsContainer';


const ChatWindowOptions = ({Members,ActiveRoomId}) =>{
    console.log("Room Id Passed to Chat Window Options is ->",ActiveRoomId);
  const [SelectedOption,setSelectedOption] = React.useState("None");
const options = [
  'None',
  "Search",
  'Add Member',
  'Remove Member'
];
var MembersList =Members;
console.log("Members List in Chat Window Options is ",MembersList);
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

console.log("In Chat Window Options->");
console.log("Chat Window Members->",Members);

  return (
    <div>
    <div>
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
          <MenuItem key={option} selected={option === anchorEl} onClick={()=>{setSelectedOption(option); setOpen(false);}}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
    <ChatWindowOptionsContainer  SelectedOption={SelectedOption}  Members={Members}  ActiveRoomId={ActiveRoomId}  />
    </div>

    


  );
}

export default ChatWindowOptions;