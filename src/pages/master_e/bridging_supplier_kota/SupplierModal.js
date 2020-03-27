import React from 'react';
import { Button, Tooltip, ButtonGroup ,Pagination, PaginationItem, PaginationLink, Modal, ModalHeader, ModalBody, ModalFooter, Table} from 'reactstrap';
import SearchOutlet from '../m_jenis_outlet/SearchOutlet'
import { MdCheckCircle } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";

class SupplierModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalSupplier: false,
      data : props.data,
      page: props.page,
      totalShown:5,
      totalPages: -1,
      result: [],
      rSelected : 1,
      initialResult: [],
      tooltipOpen : false,
      next : props.next
    };

    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
    // this.toggle = this.toggle.bind(this);
  }

  

  componentDidUpdate = (prevProps) => {
    if(this.props.data != prevProps.data){
        this.setState({
            data: this.props.data
        });
    }
}

prevPage = () => {
  //let nowPage = this.state.page - 1 < 1 ? 1 : this.state.page - 1;
  this.setState(prevState=>({
    page : prevState.page -1
  }));

  this.props.page(this.state.page)
}

nextPage = () => {
  //let nowPage = this.state.page + 1 > this.state.totalPages ? this.state.totalPages : this.state.page + 1;
 
  
  this.setState(prevState=>({
      page : prevState.page + 1
  }
  ));

 
}


  onRadioBtnClick(param){
    if(param ==1 )//search by name
    {
      this.setState({
        rSelected : 1
      });
    }
    else if(param ==2) //search by id
    {
      this.setState({
        rSelected : 2
      })
    }
  }

  //untuk search
retrieveSearchText = (text) => {
  
  this.setState({
    initialResult : this.props.data
  })

  if(this.state.rSelected ==1)//search by name
  {
    let newData = this.state.data.filter((detail) => {
      return detail.sup_Name.toLowerCase().indexOf(text) != -1;
    });

  
    this.setState({
        data: text === "" ? this.state.initialResult : newData
    });

  }    
  else  if(this.state.rSelected == 2)//search by id
  {
    let newData = this.state.data.filter((detail) => {
      return detail.covSupp_Supcode.toLowerCase().indexOf(text) != -1;
    });

  
    this.setState({
        data: text === "" ? this.state.initialResult : newData
        
    });

  }    

   
}

//modal Supplier
  toggle=()=> {
    this.setState(prevState => ({
        modalSupplier: !prevState.modalSupplier
    }));
  }


  closeModal=()=>
  {
    this.toggle()
  }

  toggleTooltip=()=> {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }


  render() {

    return (
      
      <div>      
        
        <Button color ="info" style = {{background: "#349F9B" , border : "#349F9B", display: 'flex', justifyContent: 'left'}}  onClick={()=>{this.toggle(); this.props.supplierClick()}}><span  href="#" id="TooltipSupplier">Supplier</span></Button>
        <Tooltip placement="right" isOpen={this.state.tooltipOpen} target="TooltipSupplier" toggle={()=>this.toggleTooltip()}>
          Select Supplier Here !
        </Tooltip>
        <Modal size = 'lg' isOpen={this.state.modalSupplier} toggle={this.toggle} className={this.props.className}  backdrop ={'static'} keyboard ={false}>
          <ModalHeader  onClick={()=>this.props.modalClose() }toggle={()=>this.toggle()}>Select Supplier</ModalHeader>
          <ModalBody>
            <SearchOutlet getSearchText={this.retrieveSearchText}></SearchOutlet>
         
            <ButtonGroup style={{paddingTop : 10, paddingBottom : 10}}>
                <Button size = 'sm' color="primary" onClick={() => this.onRadioBtnClick(1)} active={this.state.rSelected === 1}>By Name</Button>
                <Button size = 'sm 'color="primary" onClick={() => this.onRadioBtnClick(2)} active={this.state.rSelected === 2}>By ID</Button>

            </ButtonGroup>
            <br></br>
            
            <Table hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Kode Supplier</th>
                        <th>Nama Supplier</th>
                        <th>Alamat</th>
                        <th>Action</th>
                    </tr>
                </thead>
                {this.state.data.map((detail,index)=>{
                return <tbody>
                        <tr key={index.id}>
                            <th scope="row">{index+1}</th>
                            <td>{detail.covSupp_Supcode}</td>
                            <td>{detail.sup_Name}</td>
                            <td>{detail.sup_Address}</td>
                            <td>
                                <Button size = 'sm' style={{background : "#349F9B", border:"#349F9B"}}  onClick={()=>{ this.props.onItemClick(detail.covSupp_Supcode, detail.sup_Name, detail.sup_Address); this.closeModal(); }}>Select</Button>
                            </td>
                        </tr>                            
                    </tbody>
            
                })}
            </Table> 
            <div className = "pagination-wrapper">
              <ul className = "pagination">
              {!this.props.showAll && <Pagination >
                  <PaginationItem disabled ={this.props.page <= 1} >
                      <PaginationLink onClick={() => this.props.Pagination('prev')}>Prev</PaginationLink>
                  </PaginationItem>
                  <PaginationItem  disabled ={this.props.next == true } >
                      <PaginationLink  onClick={() => this.props.Pagination('next')}>Next</PaginationLink>
                  </PaginationItem>                                                      
                </Pagination>}

                </ul>
            </div>

            </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default SupplierModal;