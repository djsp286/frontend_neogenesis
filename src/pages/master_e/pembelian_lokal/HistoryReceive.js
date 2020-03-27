import React from 'react'
import { Form, FormGroup, Label, Input, FormText, TabContent, TabPane, Nav, NavItem, NavLink, Card, CardTitle, CardText, Row, Col, mAlert, Button, Modal, ModalHeader, ModalBody, ModalFooter, Table} from 'reactstrap';


class HistoryReceive extends React.Component{

    constructor(props) {
        super(props);    

        this.state = {
          data : props.data

        };
       
    }

    componentDidUpdate = (prevProps) => {
        if(this.props.data != prevProps.data){
            this.setState({
                data: this.props.data
            });
        }
    }

    render(){
        var a = 'testimg'
        
        return(
            <div>
                <Form>
                    <FormGroup row>
                        <Label sm={1}>Product</Label>
                        <Col sm={10} style={{display : 'flex'}}>
                            <Input  style={{width : '100px'}} disabled ={true} placeholder ={'ID'}>{a}</Input>
                            <Input style={{width : '500px'}} disabled ={true} placeholder ={'Nama'}></Input>
                            {/* <Input type="email" name="email" id="exampleEmail" placeholder={a} /> */}
                        </Col>
                        
                    </FormGroup>
                    <FormGroup row>
                    <Label sm={1}>Supplier</Label>
                        <Col sm={10} style={{display : 'flex'}}>
                            <Input  style={{width : '100px'}} disabled ={true} placeholder ={'ID'}>{a}</Input>
                            <Input style={{width : '500px'}} disabled ={true} placeholder ={'Nama'}></Input>
                            {/* <Input type="email" name="email" id="exampleEmail" placeholder={a} /> */}
                        </Col>

                    </FormGroup>
                    
                </Form>

                <Table bordered>
                    <thead>
                        <tr>
                            <th style={{textAlign : "center"}}>Tgl Receive</th>
                            <th style={{textAlign : "center"}}>Nomor Receive</th>
                            <th style={{textAlign : "center"}}>Comco Outlet</th>
                            <th style={{textAlign : "center"}}>Quantity</th>
                            <th style={{textAlign : "center"}}>Supplier ID</th>
                            <th style={{textAlign : "center"}}>Nama Supplier</th>
                        </tr>
                    </thead>
                    
                    { this.state.data.map((detail,index) =>{
                    return <tbody>
                            <tr key={index.id} >
                                <td>{detail.Tgl_Recv}</td>
                                <td style={{textAlign : "center"}}>{detail.No_Recv}</td>
                                <td style={{textAlign : "center"}}>{detail.Comco_Outlet}</td>
                                <td style={{textAlign : "center"}}>{detail.Qty}</td>
                                <td style={{textAlign : "center"}}>{detail.Supp_ID}</td>
                                <td style={{textAlign : "center"}}>{detail.Supplier}</td>
                                   
                            </tr>                            
                        </tbody>
                
                    })}
                </Table>
            </div> 

            

        )
    }
}

export default HistoryReceive;