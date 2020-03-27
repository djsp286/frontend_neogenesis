import React from 'react';
import { Alert , ButtonDropdown, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Row, Col, Table, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { GoSync } from "react-icons/go";
import { isFulfilled } from 'q';


class DeleteOutlet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //initialListOutlet : props.listOutlet,
      modal: false,
      nestedModal: false,
      closeAll: false,
      findOutletModal: false,
      dropdownOpen : false,
      confirmDeleteModal : false,
      divisi : '',
      dropdown: '',
      value: '',
      buylcld_outcode: '',
      // buylcld_supcode: '',
      // buylcld_procod: '',
      out_Code: '',
      out_code: '',
      out_Name: '',
      out_name: '',
      deleteOutlet: [],
      listOutlet: [],
      initialListOutlet : [],

      loading : false
    };

    this.toggle = this.toggle.bind(this);
    this.toggleNested = this.toggleNested.bind(this);
    this.toggleAll = this.toggleAll.bind(this);
    this.toggleFindOutlet = this.toggleFindOutlet.bind(this);
    this.toggleDropDownFindByOutlet = this.toggleDropDownFindByOutlet.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggleConfirmDelete = this.toggleConfirmDelete.bind(this)
  }

  loading =()=>
  {
      this.setState({
          loading : true
      })
  } 



  listOutlet=()=>{
 
      // var url = `http://10.0.111.52:8086/ListOutlet/${this.props.buylcld_procod}/${this.props.buylcld_supcode}`; 
      var url = `https://api.docnet.id/CHCMasterE/ListOutlet/${this.props.buylcld_procod}/${this.props.buylcld_supcode}`; 

      fetch(url, {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
        buylcld_procod : this.state.buylcld_procod,        
        buylcld_supcode : this.state.buylcld_supcode
      })
      })
      .then(blob => blob.json() )
      .then((data) => {
          data = data.filter((v) => {
              return v.out_Code !== '';
          });                 
          let newData = data
           
          this.setState({                
              //listOutlet: newData,
              initialListOutlet : newData
          },()=>{
            this.filterListOutlet();
          });                          
      });    

    //panggil filter setelah setState outletData
  }

  filterListOutlet=()=>{
    console.log(this.state.value)
    if(this.state.dropdown === ('Kode'))
    {
      let newData = this.state.initialListOutlet.filter((v) => {
        //If return false, data will be filtered
        //If return true, data will be stayed
        return v.out_Code === this.state.value;
        // , v.cityName != this.state.delName;
        
      });
  
      this.setState({
          listOutlet: newData,
          loading : false
      });
        
    }
    else if(this.state.dropdown === ('Nama'))
    {
      var input = this.state.value.toUpperCase()
      console.log(input)
      let newData = this.state.initialListOutlet.filter((v) => {
        //If return false, data will be filtered
        //If return true, data will be stayed
       // return v.out_Name.includes(input);
        // , v.cityName != this.state.delName;

       
        if(v.out_Name.includes(input)=== true)
        {
         
          return v.kota_Name, v.out_Code, v.out_Comco, v.out_Name, v.out_Address 
        }
        
      });
  
      this.setState({
          listOutlet: newData,
          loading : false
      });        
    
    }

  }

  
setDetailOutlet=(kode, nama)=>{
  this.setState({
    out_Name : nama,
    out_Code : kode
  })
}
  addOutletBaru=(kode, nama)=>{

    console.log("test")
    console.log(kode, nama)
    // var out_Code = kode
    // var out_Name = nama
  
    this.setState({
      out_Name : nama,
      out_Code : kode
    },()=>{
      //panggil fungsi request data yang mau di tampilin
      //this.listOutlet();
      this.deleteOutlet();
      this.toggleFindOutlet();
    })
  
    
  }
  
  deleteOutlet=()=>{
    // var url = `http://10.0.111.66:8086/deleteOutlet/${this.state.divisi}`; 
  
    // fetch(url, {
    // method: "POST",
    // headers: {
    //     "Content-Type": "application/json"
    // },
    // body: JSON.stringify({        
    //     pri_group : this.state.divisi
    // })
    // })
    // .then(blob => blob.json() )
    // .then((data) => {
    //     data = data.filter((v) => {
    //         return v.buylcld_procod !== '';
    //     });                 
    //     let newData = data
    //     console.log('produk ' + data)   
    //     this.setState({                
    //         deleteOutlet: newData
    //     });                          
    // });  

    if(this.state.divisi === 1)
    {
      // let url = `http://10.0.111.52:8086/viewDeleteApotik/${this.state.out_Code}`; 
      let url = `https://api.docnet.id/CHCMasterE/viewDeleteApotik/${this.state.out_Code}`; 
    
      fetch(url, {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({        
        buylcld_outcode : this.state.out_Code
      })
      })
      .then(blob => blob.json() )
      .then((data) => {
        console.log(data)
          data = data.filter((v) => {
              return v.buylcld_procod !== '';
          });                 
          let newData = data
          console.log('produk ' + data)   
          this.setState({                
              deleteOutlet: newData
          });                          
      });  

    }
    else if(this.state.divisi ===2)
    {
      // let url = `http://10.0.111.52:8086/viewDeleteFloor/${this.state.out_Code}`; 
      let url = `https://api.docnet.id/CHCMasterE/viewDeleteFloor/${this.state.out_Code}`; 
    
      fetch(url, {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({        
        buylcld_outcode : this.state.out_Code
      })
      })
      .then(blob => blob.json() )
      .then((data) => {
        console.log(data)
          data = data.filter((v) => {
              return v.buylcld_procod !== '';
          });                 
          let newData = data
          console.log('produk ' + data)   
          this.setState({                
              deleteOutlet: newData
          });                          
      });  

    }
  }


    
    confirmDeleteOutlet=()=>
    { 
        this.deletingOutlet(); 
        this.toggleConfirmDelete();
        
        document.getElementById("radio1").checked = false//uncheck radio button
        document.getElementById("radio2").checked = false//uncheck radio button
        this.exit()
        // this.setState({
        //   divisi : '',
        //   value: '', 
        //   buylcld_outcode: '',
        //   out_Code: '',
        //   out_Name: '',
        //   deleteOutlet: [],
        //   listOutlet: []
      
        // })
    }

  deletingOutlet=()=>
  {
    // let url = `http://10.0.111.52:8086/deleteData/${this.props.buylcld_procod}/${this.props.buylcld_supcode}/${this.state.out_Code}`
    let url = `https://api.docnet.id/CHCMasterE/deleteData/${this.props.buylcld_procod}/${this.props.buylcld_supcode}/${this.state.out_Code}`

    let payload ={
        //id supplier, id kota
        buylcld_procod : this.props.buylcld_procod,
        buylcld_supcode : this.props.buylcld_supcode,
        buylcld_outcode: this.state.out_Code

    }
    
    fetch(url, {
      method: "POST",
      body: JSON.stringify(payload),
      json: true,
      headers :
          {
              "Content-type":"application/json; charset-UTF-8"
          }
      })
      .then(response => {
          if (response.ok) {
              console.log("data Deleted") 
              this.props.requestListOutlet()//request data outlet di home  
          }
      });               
  }

  toggle() {
    console.log('delete outlet')
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  toggleNested() {
    this.setState({
      nestedModal: !this.state.nestedModal,
      closeAll: false
    });
  }

  toggleAll() {
    this.setState({
      nestedModal: !this.state.nestedModal,
      closeAll: true
    });
  }

  toggleFindOutlet=()=>{
    this.setState(prevState => ({
        findOutletModal: !prevState.findOutletModal
        
    }));
    this.setState({
      loading : false,
      dropdown : ''
    })
  }

  toggleConfirmDelete=()=>{
    this.setState(prevState => ({
        confirmDeleteModal: !prevState.confirmDeleteModal
    }));
  }

  toggleDropDownFindByOutlet() {
    this.setState(prevState => ({
      dropDownFindByOutlet: !prevState.dropDownFindByOutlet
    }));
  }

  toggleDropDown=()=> {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  setDropDown=(dropdown)=>
  {
    this.setState({
        dropdown : dropdown
    })
  } 

  setDivisi=(kode)=>{
    this.setState({
        divisi : kode
    });
  }


  handleChange(event) {
    this.setState({value: event.target.value});
  }

  exit=()=>{
    this.setState({
      divisi : '',
      value: '',
      buylcld_outcode: '',
      out_Code: '',
      out_Name: '',
      deleteOutlet: [],
      listOutlet: []

    })
    this.toggle()
  }
    

  render(){
    console.log('list outlet '+this.state.listOutlet)
    return (
      <div>
        <Button style = {{background: "#31807D", border: "#31807D", borderRadius:"8px"}} size = 'sm' color="danger" onClick={() =>this.exit()}>{this.props.buttonLabel}Delete Outlet</Button>
        <Modal size = 'xl' isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} backdrop ={'static'} keyboard ={false}>
          <ModalHeader toggle={this.toggle}>Delete Outlet</ModalHeader>
          <ModalBody>
          
          <Row>
          <p style = {{marginLeft: '35px', fontWeight:'bold'}}>Divisi</p>
          <Col style = {{display: 'flex'}}>  
            <text>
              <FormGroup check>
              <Label style = {{marginLeft: '125px'}}check>
                <Input type="radio" id="radio1" name="radio1" onClick={()=> this.setDivisi(1)}/>{' '}
                Apotik    
              </Label>
              </FormGroup>
            </text>
            <text>
            <FormGroup check>
              <Label style = {{marginLeft: '35px'}}check>
                <Input type="radio" id="radio2"  name="radio1" onClick={()=> this.setDivisi(2)}/>{' '}
                Floor
              </Label>
            </FormGroup>
            </text>
          </Col>
        </Row>
        

        <FormGroup row style={{paddingLeft : 20}}>
        <Label sm={2}>Outlet</Label>
          <Col sm={10} style={{display : 'flex'}}>
              <Input  style={{width : '100px'}} disabled placeholder ={this.state.out_Code}></Input>
              <Input style={{width : '500px'}} disabled placeholder ={this.state.out_Name}></Input>
              <Button size = 'sm'style = {{background: "#349F9B", border: "#349F9B", borderRadius:"8px", marginLeft : 5}} disabled ={this.state.divisi === ''}onClick={()=>{this.toggleFindOutlet()}}>?</Button>
              {/* <Input type="email" name="email" id="exampleEmail" placeholder={a} /> */}
          </Col>
        </FormGroup>

        <Modal size = 'xl' isOpen = {this.state.findOutletModal} toggle={this.toggleFindOutlet}onClosed = {this.state.closeAll ? this.toggle :undefined}>
            <ModalHeader>Find Delete Outlet</ModalHeader>
            <ModalBody>
            <FormGroup row style ={{marginTop : 10}} >
                <Label sm={2} style ={{marginRight : 0, paddingLeft : 35}} >Find By</Label>
                <Col sm={10} style={{display : 'flex'}}>
                <ButtonDropdown size = 'sm' isOpen={this.state.dropdownOpen}  toggle={()=>this.toggleDropDown()}>
                    <DropdownToggle caret size = 'sm'style = {{background: "#349F9B", border: "#349F9B", borderRadius:"8px"}}>
                        {this.state.dropdown}
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={()=>this.setDropDown('Kode')}>Kode</DropdownItem>
                        <DropdownItem onClick={()=>this.setDropDown('Nama')}>Name</DropdownItem>
                    </DropdownMenu>
                </ButtonDropdown>
                    {/* <input  disabled ={this.state.dropdown === ''} style={{width : '100%', marginLeft : 3}}  type="text" value={this.state.value} onChange={this.handleChange} /> */}
                    <Input  disabled ={this.state.dropdown === ''} 
                        style={{width : '100%', marginLeft : 3}}  
                        type="text" value={this.state.value} 
                        onChange={this.handleChange} />
                    <Button size = 'sm'style = {{background: "#349F9B", border: "#349F9B", borderRadius:"8px", marginLeft : 5}} disabled ={this.state.value === '' || this.state.loading} onClick={()=>{this.listOutlet(); this.loading()}}>
                      {this.state.loading && <i><GoSync></GoSync></i>}
                      {this.state.loading === false && 'Find'  }   
                    </Button>
                </Col>
            </FormGroup>
         
                
                <Table hover style = {{textAlign: 'center'}}>
                  <thead>
                      <tr>
                          <th>No.</th>
                          <th>Kota</th>
                          <th>Kode Outlet</th>
                          <th>Comco</th>
                          <th>Nama Outlet</th>
                          <th>Alamat</th>
                          <th>Action</th>
                      </tr>
                  </thead>

                  {this.state.listOutlet.map((detail,index)=>{
                      return <tbody>
                              <tr key={index.id}>
                                  <th scope="row">{index+1}</th>
                                  <td>{detail.kota_Name}</td>
                                  <td>{detail.out_Code}</td>
                                  <td>{detail.out_Comco}</td>
                                  <td>{detail.out_Name}</td>
                                  <td>{detail.out_Address}</td>
                                  <td>      
                                    <Button onClick={()=>{this.addOutletBaru(detail.out_Code, detail.out_Name)}}>Select</Button>                              
                                      {/* <Button onClick={()=>{this.setDetailOutlet((detail.out_Code, detail.out_Name))}}>Select</Button> */}
                                  </td>
                              </tr>
                          </tbody>
                      })}
                  </Table> 
            
              
            </ModalBody>
        </Modal>
          
          <Table bordered >
          <thead style = {{textAlign: 'center'}}>
                            <tr>
                                <th>Procode</th>
                                <th>Nama Produk</th>
                                <th>Supcode</th>
                                <th>Nama Supplier</th>
                                <th>LgBupri</th>
                                <th>Disc</th>
                                <th>LnBupri</th>
                                <th>HJA</th>
                                <th>Margin</th>
                            </tr>
                        </thead>

                        {this.state.deleteOutlet.map((detail,index)=>{
                            return <tbody style = {{textAlign: 'center'}}>
                                    <tr key={index}>
                                        <td>{detail.buylclh_Procod}</td>
                                        <td>{detail.pro_Name}</td>
                                        <td>{detail.buylclh_Supcode}</td>
                                        <td>{detail.sup_Name}</td>
                                        <td>{detail.buylclh_Lgbupri}</td>
                                        <td>{detail.buylclh_Disc}</td>
                                        <td>{detail.buylclh_Lnbupri}</td>
                                        <td>{detail.buylclh_Hja}</td>
                                        <td>{detail.buylclh_margin}</td>
                                    </tr>                            
                                </tbody>
                            })}
                    </Table>
            
          </ModalBody>
          <ModalFooter style = {{display: 'flex', justifyContent: 'center'}}>
            <Button size = 'sm'style = {{background: "#349F9B", border: "#349F9B", borderRadius:"8px"}} onClick={this.toggleConfirmDelete}>Delete</Button>{' '}
            <Button size = 'sm'style = {{background: "#F8A151", border: "#F8A151", borderRadius: "8px" }} color="secondary" onClick={()=>this.exit()}>Exit</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.confirmDeleteModal} toggle={this.toggleConfirmDelete}>
        <ModalHeader toggle={this.toggleConfirmDelete}>Delete Confirmation</ModalHeader>
        <ModalBody>
            Are you sure you want to delete Outlet:  {this.state.out_Name} [{this.state.out_Code}]?
        </ModalBody>
        <ModalFooter>
          <Button size = 'sm'style = {{background: "#349F9B", border: "#349F9B", borderRadius:"8px"}} onClick={()=>this.confirmDeleteOutlet()}>Delete </Button>{' '}
          <Button size = 'sm'style = {{background: "#F8A151", border: "#F8A151", borderRadius: "8px" }} onClick={this.toggleConfirmDelete}>Cancel</Button>
        </ModalFooter>
      </Modal>
      </div>
    );
  }
}

export default DeleteOutlet;