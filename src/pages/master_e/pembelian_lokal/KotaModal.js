import React from 'react'
import { Form, FormGroup, Label, Input, FormText, TabContent, TabPane, Nav, NavItem, NavLink, Card, CardTitle, CardText, Row, Col, mAlert, Button, Modal, ModalHeader, ModalBody, ModalFooter, Table} from 'reactstrap';

class KotaModal extends React.Component{

    
    constructor(props) {
        super(props);       
        this.state = {
            data : props.data,
            modalKota : props.modalKota
        };
        
    }

    componentDidUpdate = (prevProps) => {
        if(this.props.modalKota != prevProps.modalKota){
            this.setState({
                modalKota: this.props.modalKota
            });
        }
        if(this.props.data != prevProps.data){
            this.setState({
                data: this.props.data
            });
        }
    }
   
    toggleKota=()=>{
        this.setState(prevState => ({
            modalKota: !prevState.modalKota
          }));
    }

    render(){
        return(
            
            <div>

                 <Modal isOpen={this.state.modalKota} toggle={()=>this.toggleKota()} className={this.props.className} backdrop ={'static'} keyboard ={false}>
                <ModalHeader onClick={()=>this.props.modalClose()} toggle={()=>this.toggleKota()}>Pilih Kota</ModalHeader>
                <ModalBody>
                <Table hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nama Kota</th>
                            <th>ID Kota</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    {this.state.data.map((detail,index)=>{
                    return <tbody>
                            <tr key={index}>
                                <th scope="row">{index+1}</th>
                                <td>{detail.kota_Name}</td>
                                <td>{detail.covsupp_Kota}</td>
                                <td>
                                    <Button size = 'sm'  onClick={()=>this.props.onItemClick(detail.covsupp_Kota,detail.kota_Name)}>Select</Button>
                                </td>
                            </tr>                            
                        </tbody>
                
                    })}
                </Table>
                   
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={()=>this.toggleKota()}>Batalkan</Button>
                </ModalFooter>
                </Modal>

            </div>
           
        )
    }

}

export default KotaModal;