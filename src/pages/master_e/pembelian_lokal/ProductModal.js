import React from 'react'
import { Form, FormGroup, Label, Input, FormText, TabContent, TabPane, Nav, NavItem, NavLink, Card, CardTitle, CardText, Row, Col, mAlert, Button, Modal, ModalHeader, ModalBody, ModalFooter, Table} from 'reactstrap';


class ProductModal extends React.Component{

    constructor(props) {
        super(props);       
        this.state = {
            data : props.data,
            productModal : props.productModal
        };
        
    }

    componentDidUpdate = (prevProps) => {
        if(this.props.productModal != prevProps.productModal){
            this.setState({
                productModal: this.props.productModal
            });
        }
        if(this.props.data != prevProps.data){
            this.setState({
                data: this.props.data
            });
        }
    }

  

    toggleProduct =()=> {
        this.setState(prevState => ({
          productModal: !prevState.productModal
        }));
    }

    

    render(){
        return(
            <div>             
                <Modal isOpen={this.state.productModal} toggle={()=>this.toggleProduct()} className={this.props.className}backdrop ={'static'} keyboard ={false}>
                <ModalHeader onClick={()=>this.props.modalClose()} toggle={()=>this.toggleProduct()}>Pilih Produk</ModalHeader>
                <ModalBody>
                    <Table hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Kode Produk</th>
                            <th>Nama Produk</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    {this.state.data.map((detail,index)=>{
                    return <tbody>
                            <tr key={index.id}>
                                <th scope="row">{index+1}</th>
                                <td>{detail.buylcld_Procod}</td>
                                <td>{detail.pro_Name}</td>
                                <td>
                                    <Button size = 'sm' style = {{background: "#349F9B", border: "#349F9B", borderRadius:"8px"}} onClick={()=>this.props.onItemClick(detail.buylcld_Procod, detail.pro_Name)}>Select</Button>
                                </td>
                            </tr>                            
                        </tbody>
                
                    })}
                </Table> 

                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" style = {{background: "#F8A151", border: "#F8A151", borderRadius: "8px"}}onClick={()=>this.props.modalClose()}>Batalkan</Button>
                </ModalFooter>
                </Modal>
            </div>        
        )
    }
}

export default ProductModal;