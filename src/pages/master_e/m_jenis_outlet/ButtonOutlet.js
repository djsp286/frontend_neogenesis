import React from 'react';
import { Button } from 'reactstrap';

class ButtonOutlet extends React.Component{

    Add= function AddButton(){
        prompt('Jengjeng')
    }

    render(){
        return(
            <div>
                <Button color="success" onClick={this.Add}>Add</Button>{' '}
                <Button color="warning">Print</Button>{' '}
                <Button color="danger">Delete</Button>{' '}
            </div>
        );
    }
}


export default ButtonOutlet