import React from 'react';
import { Button, Form, Input } from 'reactstrap';

const SearchOutletPL= (props) => {

  return (
    <div>
        <Form style={{marginLeft: 135}} inline onSubmit={e => e.preventDefault()}>
            <Input disabled ={props.findBy === ''} style={{width : 420}}
                type="search"
                placeholder=""
                onChange = {(e) => props.getSearchText(e.target.value.toLocaleLowerCase())}
            />
            {/* <Button size="20">Find</Button> */}
        </Form>
         
    </div>
   

  );
};

export default SearchOutletPL;