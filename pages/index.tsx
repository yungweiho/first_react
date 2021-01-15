import React, {useState} from "react";
import { Container } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { gql, useLazyQuery } from "@apollo/client";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';

export const CHARACTER_QUERY = gql`
  query queryCharacter($search: String!) {
    Character(search: $search) {
      name {
        full
        native
      }
      image {
        medium
      }
    }
    
  }
`;

export const STAFF_QUERY = gql`
  query queryStaff($search: String!) {
    Staff(search: $search) {
      name {
        full
        native
      }
      image {
        medium
      }
    }
  }
`;

const useStyles = makeStyles((theme) =>
  // TODO
  createStyles({
    searchBlock: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      top: '200px',
    },
    selectCustom: {
      position: 'relative',
      top: '15px',
      marginRight: '10px',
      letterSpacing: '1px'
    },
    buttonCustom: {
      position: 'relative',
      top: '10px',
      marginLeft: '10px'
    },
    noText: {
      color: 'red'
    }
  }),
);

function AniSearch() {
  const classes = useStyles();

  const [getCharacter, characterResult] = useLazyQuery(CHARACTER_QUERY);
  const [getStaff, staffResult] = useLazyQuery(STAFF_QUERY);
  const [search_text, setSearchData] = useState("");
  const [search_type, setSearchType] = useState('Character');
  const type_text = (e) => {
    setSearchData(e.target.value);
  }
  const handleChange = e => {
    if (e.target.value === 'Character') {
      setSearchType(e.target.value);
    } else if (e.target.value === 'Staff') {
      setSearchType(e.target.value);
    }
  }
  const search = () => {
    if (search_type === 'Character' && search_text !== "") {
      return getCharacter({variables: {search: search_text}});
    } else if (search_type === 'Staff' && search_text !== "") {
      return getStaff({variables: {search: search_text}});
    }
  }
  const results = () => {
    if (search_type === 'Character' && characterResult.data && characterResult.data.Character !== null) {
      return characterResult.data.Character.name.full;
    } else if (search_type === 'Staff' && staffResult.data && characterResult.data.Character !== null) {
      return staffResult.data.Staff.name.full;
    } else {
      return 'No result.';
    }
  }

  return <Container className={classes.searchBlock}>
    <div>
      <InputLabel id="demo-simple-select-label">Search Type</InputLabel>
      <Select className={classes.selectCustom} labelId="label" id="select" value={search_type} onChange={handleChange}>
        <MenuItem value="Character">Character</MenuItem>
        <MenuItem value="Staff">Staff</MenuItem>
      </Select>
      <TextField id="standard-basic" label="Keyword" value={search_text} onChange={type_text}/>
      <Button className={classes.buttonCustom} variant="outlined" onClick={() => search()}>search</Button>
      <h1>
        {results()}
      </h1>
      <img src={search_type === 'Character' ? (characterResult.data && characterResult.data.Character.image.medium) : (staffResult.data && staffResult.data.Staff.image.medium)} alt=""/>
    </div>
  </Container>;
}

export default AniSearch;
