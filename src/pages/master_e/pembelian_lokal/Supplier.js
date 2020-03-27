import React from 'react'
import { Pagination, PaginationItem, PaginationLink, Button, Modal, ModalHeader, ModalBody, ModalFooter, Table} from 'reactstrap';
import SearchOutlet from '../m_jenis_outlet/SearchOutlet'
import { GoVerified } from "react-icons/go";
import { FaCheckSquare } from "react-icons/fa";

class SupplierModal extends React.Component{

    constructor(props) {
        super(props);       
        this.state = {
            data : props.data,
            initialResult : props.data,
            supplierModal : props.supplierModal,
            page: -1,
            totalShown:25,
            totalPages: -1
        };
        
    }

    componentDidUpdate = (prevProps) => {
        if(this.props.supplierModal != prevProps.supplierModal){
            this.setState({
                supplierModal: this.props.supplierModal
            });
        }
        if(this.props.data != prevProps.data){
            this.setState({
                data: this.props.data,
                initialResult : this.props.data,
                page: 1,
                totalPages: Math.ceil(this.props.data.length / this.state.totalShown)
            });
        }
    }

    toggleSupplier=()=>{
        this.setState(prevState => ({
            supplierModal: !prevState.supplierModal,
            data : this.state.initialResult,
            page : 1
        }));       
    }

    prevPage = () => {
        let nowPage = this.state.page - 1 < 1 ? 1 : this.state.page - 1;
        this.setState({
            page: nowPage
        });
    }

    nextPage = () => {
        let nowPage = this.state.page + 1 > this.state.totalPages ? this.state.totalPages : this.state.page + 1;
        this.setState({
            page: nowPage,
            totalShown : 25,
            totalPages : Math.ceil(this.state.data.length / this.state.totalShown)
        });
    }

    retrieveSearchText = (text) => {
  
        this.setState({
          initialResult : this.props.data
        })      
       
        let newData = this.state.data.filter((detail) => {
            return (detail.Sup_Name.toLowerCase().indexOf(text) !== -1 ||detail.Sup_Code.toLowerCase().indexOf(text) !== -1);
        });    

        this.setState({
            data: text === "" ? this.state.initialResult : newData
        });  
    }

    render(){
      
        let startData = (this.state.page - 1) * this.state.totalShown;
        let endData = this.state.page * this.state.totalShown;        
        
        return(
            <div>
                <Modal size = 'lg'isOpen={this.state.supplierModal} toggle={()=>this.toggleSupplier()} className={this.props.className} backdrop ={'static'} keyboard ={false}>
                    <ModalHeader onClick={()=>this.props.modalClose()} toggle={()=>this.toggleSupplier()}>Pilih Supplier</ModalHeader>
                    
                    <ModalBody>
                        <SearchOutlet getSearchText={this.retrieveSearchText}></SearchOutlet>
                        <Table hover style={{marginTop : 10, textAlign : "center"}}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Kode Supplier</th>
                                    <th>Nama Supplier</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {this.state.data.map((detail,index)=> 
                            startData <= index && index < endData &&
                            
                                    <tr key={index}>
                                        <th scope="row">{index+1}</th>
                                        <td>{detail.Sup_Code}</td>
                                        <td>{detail.Sup_Name}</td>
                                        <td>
                                            {/* <Button color="light" onClick={()=>this.props.onItemClick(detail.sup_Code,detail.sup_Name)}><GoVerified style={{width : 20, height : 20}}color ='green' ></GoVerified></Button> */}
                                            
                                            <Button size = 'sm' style = {{background: "#349F9B", border: "#349F9B", borderRadius:"8px"}} onClick={()=>this.props.onItemClick(detail.Sup_Code,detail.Sup_Name)}>Select</Button>
                                        </td>
                                    </tr> 
                                    )}                           
                                </tbody>    
                        </Table> 

                        <Pagination >
                            <PaginationItem disabled={this.state.page == 1} onClick={() => this.prevPage()}>
                                <PaginationLink >Prev</PaginationLink>
                            </PaginationItem>
                            <PaginationItem disabled={(this.state.page == this.state.totalPages)} >
                                <PaginationLink  onClick={() => this.nextPage()}>Next</PaginationLink>
                            </PaginationItem>                                                      
                        </Pagination>
                        
                    </ModalBody>
                    
                    <ModalFooter>
                        <Button color="secondary" style = {{background: "#F8A151", border: "#F8A151", borderRadius: "8px" }} onClick={()=>this.props.modalClose()}>Batalkan</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default SupplierModal;