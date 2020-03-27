import React from 'react'
import {   Alert, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Table, Form, FormGroup, Label, Input} from 'reactstrap';
import SupplierModal from './Supplier';
import { GoSync } from "react-icons/go";



class DeletePrincipal extends React.Component{

    constructor(props) {
        super(props);       
        this.state = {
            supplierData : [],
            principalData :[],
            outletData : [],
            requestProduct : [],
            produkData : [],
            deleteData : [],
            buylcld_Outcode : [],
            principalId : '',
            principalName : '',
            supId : '',
            supName : '',
            divisi : '', 
            del_outCode : '',
            selectAll : false,
            principalModal : false,
            supplierModal : false,
            findPrincipalModal : false,
            deleteModal : false,
            dropdownOpen : false,
            dropdown : '',
            value: '',

            count : 0,
            loading : false
        };
        
        this.handleChange = this.handleChange.bind(this)
    }


    loading =()=>
    {
        this.setState({
            loading : true
        })
    }
    
    componentDidUpdate = (prevProps) => {
        if(this.props.data != prevProps.data){
            this.setState({
                data: this.props.data
            });
        } 
        if(this.props.produk != prevProps.produk){
            this.setState({
                produk: this.props.produk
            });
        }   
    }

    togglePrincipal=()=> {
        this.setState(prevState => ({
            principalModal: !prevState.principalModal
        }));
    }

    toggleSupplier=()=> {
        this.setState(prevState => ({
          supplierModal: !prevState.supplierModal
        }));
    }

    toggleFindPrincipal=()=>{
        this.setState(prevState => ({
            findPrincipalModal: !prevState.findPrincipalModal
        }));
    }
    
    toggleDeleteOutlet=()=>{
        this.setState(prevState => ({
            deleteModal: !prevState.deleteModal
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

    handleChange(event) {
        this.setState({value: event.target.value});
    }


    modalClose=()=>
    {
        this.setState({
            supplierModal : false,
            
        })
    }

    setDivisi=(kode)=>{
        this.setState({
            divisi : kode
        });
    }
   
    //buat find principal

    findPrincipal=()=>{
        if(this.state.dropdown ==='Kode'){
            // var url = `http://10.0.111.65:8087/MasterPrincipal/TampilkanPrincipalbyCode/${this.state.value}`;
            // var url = `http://10.0.111.37:8087/MasterPrincipal/TampilkanPrincipalbyCode`;
            var url = `https://api.docnet.id/CHCMasterD/MasterPrincipal/TampilkanPrincipalbyCode`;
            fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                pri_code : this.state.value
            })
            })
            .then(blob => blob.json() )
            .then((data) => {
                console.log(data.Data);
                // let newData = data.Data.filter((v) => {
                //     return v.Pri_Code !== '';
                // });

                this.setState({
                    principalData: data.Data,
                    loading : false
                },()=>console.log(this.state.principalData));
            });

        }
        if(this.state.dropdown ==='Name')
        {
            // var url = `http://10.0.111.54:8086/cariPrincipalName/${this.state.value}`;
            // var url =`http://10.0.111.37:8087/MasterPrincipal/CariNamaPrincipal`
            var url =`https://api.docnet.id/CHCMasterD/MasterPrincipal/CariNamaPrincipal`;

            fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                pri_name : this.state.value
            })
            })
            .then(blob => blob.json() )
            .then((data) => {
                console.log(data)
                // let newData = data.Data.filter((v) => {
                //     return v.Pri_Name !== '';
                // });  

                this.setState({
                    principalData: data.Data,
                    loading : false
                },()=>console.log(this.state.principalData));
            });
        }          
    }

    getPrincipalDetail=(code, name)=>{
        this.setState({
            principalId : code,
            principalName : name,
            supId : '',
            supName : '',
            produkData : [],
            outletData : []
        },()=>{
            this.clearChecked();
            this.findSupplier();
        });
    }  

    findSupplier=()=>{
        // var supplier = `http://10.0.111.37:8087/MasterSupplier/TampilkanSupplier`
        var supplier = `https://api.docnet.id/CHCMasterD/MasterSupplier/TampilkanSupplier`

        fetch(supplier)
        .then(blob => blob.json() )
        .then((data) => {
            console.log(data)
            // data = data.Data.filter((v) => {
            //     return v.Sup_Name !== '';
            // });

            this.setState({
                supplierData : data.Data
                
            });
        }); 
    }

    getSupplierDetail=(supId,supName)=>{
        this.setState({
            supId : supId,
            supName : supName,
            supplierModal : false
            
        }, () => {
            
            this.findOutletPrincipal();
            //this.findProdukPrincipal();
        });
    }

    findOutletPrincipal=()=>
    {
        // var url = `http://10.0.111.52:8086/showOutlet/${this.state.supId}`; 
        var url = `https://api.docnet.id/CHCMasterE/showOutlet/${this.state.supId}`; 

        fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            buylcld_supcode : this.state.supId
        })
        })
        .then(blob => blob.json() )
        .then((data) => {
            console.log(data)
         
            data = data.filter((v) => {
                return v.out_Comco !== '';
            });  
            console.log('outlet ' + data)               
            let newData = data
            
            this.setState({                
                outletData: newData
            });    

         
                                 
        });  

    }

    setOutcode=()=>{
        let buylcld_Outcode
        var check = document.getElementsByName("checkbox")
        let newData
        var data= []

        this.setState({
            buylcld_Outcode : []
        },()=>{
            for(let a = 0;a < check.length ; a++)
            {
                if(check[a].checked === true)
                {               
                    buylcld_Outcode =check[a].value
                    newData = [{buylcld_Outcode}]
                    
                    data = data.concat(newData)            
                }            
            }

            console.log(data)
            this.setState({
                buylcld_Outcode : this.state.buylcld_Outcode.concat(data),
                count : data.length
            })  

        })
    }

    selectAllProduct=()=>{
        {this.state.buylcld_Outcode.map((v)=>{
                                
            this.findProdukPrincipal(v.buylcld_Outcode)
                
        })}
        
    }

    findProdukPrincipal=(kode)=>{  

        console.log("request product")
    
        // var url = `http://10.0.111.52:8086/showProduk/${this.state.supId}/${kode}/${this.state.principalId}`; 
        var url = `https://api.docnet.id/CHCMasterE/showProduk/${this.state.supId}/${kode}/${this.state.principalId}`; 

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                buylclh_supcode : this.state.supId,
                buylcld_outcode: kode,
                pro_princode : this.state.principalId
            })
        })
        .then(blob => blob.json() )
        .then((data) => {
            
            data = data.filter((v) => {
                return v.pro_Name !== '';
            });  
                        
            let newData = data
            
            this.setState({                
                produkData: newData
            },()=>{

                let buylcld_Procod
                let newData
                var data = []
                var newProd =[]

                {this.state.produkData.map((v)=>{

                    console.log(v.buylcld_Procod)
                    buylcld_Procod = v.buylcld_Procod
                    newData = [{buylcld_Procod}]
                    
                    data = data.concat(newData)                      
    
                })};
                this.state.buylcld_Outcode[this.state.buylcld_Outcode.map(x => x.buylcld_Outcode).indexOf(kode)]['buylcld_Procod'] = data
                               
                
                var newProd = []
                // var newData =[]
                let buylcld_Outcode
                let flag = 0
                // let buylcld_Procod
               
                {this.state.buylcld_Outcode.map((v)=>{

                    {this.state.requestProduct.map((detail)=>{ 
                        if(v.buylcld_Outcode === detail.buylcld_Outcode)
                        {
                            flag = 1
                        }  
                        else {
                            flag = 0
                        }  
                    })}

                    if(flag === 0)
                    {
                        buylcld_Outcode = v.buylcld_Outcode
                        buylcld_Procod = v.buylcld_Procod
                        newData = [{buylcld_Outcode,buylcld_Procod}]
                        newProd = newProd.concat(newData)
                    }
                    
                })}
    
                this.setState({
                    // requestProduct : this.state.requestProduct.concat([{data}])
                    requestProduct : this.state.requestProduct.concat(newProd)
                },()=>{
                    console.log(this.state.requestProduct)
                    // console.log(this.state.buylcld_Outcode)
                })    



              
                
                // this.setState({
                //     // requestProduct : this.state.requestProduct.concat([{data}])
                //     requestProduct : this.state.buylcld_Outcode
                // },()=>{
                //     console.log(this.state.requestProduct)
                //     // console.log(this.state.buylcld_Outcode)
                // })

           

                
            //     var buylcld_Procod =[]
            //     {this.state.produkData.map((detail) =>{ 
                                                    
            //         buylcld_Procod = buylcld_Procod.concat([detail.buylcld_Procod])          
            //     })}

            //     // const newOutlet= [{buylcld_Outcode, buylcld_Procod}]   
                
            //     this.setState({
            //         requestProduct : this.state.requestProduct.concat([{buylcld_Outcode,buylcld_Procod}])
            //     },()=>{
            //         console.log(this.state.requestProduct)
            //     })
             });                          
        });  
        
    
        // let newData = this.state.requestProduct.filter((v)=>
        // {
        //     while(v.buylcld_Outcode !== kode){
        //         return v.buylcld_Outcode, v.procod
        //     } 
        // });
        // this.setState({
        //     count : buylcld_Outcode.length,
        //     requestProduct : newData
        // });       
       
    }

    //check all
    handleChecked =()=> {       

        //check all checkbox di table outlet
        var check = document.getElementsByName("checkbox")
        var all = document.getElementById("chkAll")       

        var b=0;       

        for (b=0;b<check.length;b++)
        {               
            
            if(all.checked === true)
            {
                check[b].checked = true;
            }
            else{
                check[b].checked = false;
            }                
        }  
        this.setOutcode();     
    }

    //checked satu2
    handleCheckedDelete=()=>{
        var checked = document.getElementsByName("checkbox")
        var all = document.getElementById("chkAll")
       
        //untuk check select all saat semua pilihan di check
        let count = 0
        for(var a = 0; a < checked.length ; a++)
        {
            if(checked[a].checked === true)
            {
                count = count + 1  
            }
        }

        if ( count === checked.length )
        {
            all.checked = true
           
        }
        else if (count !== checked.length)
        {
            all.checked = false
            
        }    
        
        
    }

    clearChecked=()=>{

        var checkAll = document.getElementsByName("checkAll")
        var all = document.getElementById("chkAll")
        all.checked = false

        console.log(checkAll.checked)
       
        var check = document.getElementsByName("checkbox")
        var b = 0;

        for (b=0;b<check.length;b++)
        {
            check[b].checked = false;            
        }

        checkAll.checked = false
        
    }

    setDeleteOutlet=()=>
    {
        let buylcld_Outcode
        var check = document.getElementsByName("checkbox")
        let newData
        var data= []
        for(let a = 0;a < check.length ; a++)
        {
            if(check[a].checked === true)
            {               
                buylcld_Outcode =check[a].value
                newData = [{buylcld_Outcode}]
                
                data = data.concat(newData)            
            }            
        }

        console.log(data)
        this.setState({
            deleteData : this.state.deleteData.concat(data)
        })    
    }

    confirmDeleteOulet=()=>
    { 
        this.deletingOutlet() 
        this.toggleDeleteOutlet();

    }

    deletingOutlet=()=>
    {
        { this.state.deleteData.map((detail) =>{ 
            
            {this.state.requestProduct.map((v)=>{
                if(detail.buylcld_Outcode === v.buylcld_Outcode)
                {
                    console.log(v.buylcld_Outcode)
                    for(let i = 0; i < v.buylcld_Procod.length; i++ ){
                        //fungsi delete di sini

                        console.log(v.buylcld_Procod[i])
                        // let url = `http://10.0.111.52:8086/deleteData/${this.state.requestProduct.buylcld_Procod[i]}/${this.state.supId}/${detail.buylcld_Outcode}`
                        let url = `https://api.docnet.id/CHCMasterE/deleteData/${this.state.requestProduct.buylcld_Procod[i]}/${this.state.supId}/${detail.buylcld_Outcode}`

                        let payload ={
                            buylcld_procod : this.state.requestProduct.buylcld_Procod[i],
                            buylcld_supcode : this.state.supId,
                            buylcld_outcode : detail.buylcld_Outcode

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
                                this.findOutletPrincipal()
                                console.log("data Deleted")

                                this.clearChecked()
                            }
                        }); 
                        
                    }
                }

            })}
            // let url = `http://10.0.111.52:8086/deleteAllOutlet/${detail.buylcld_Outcode}`
        
            // let payload ={
            //     //id supplier, id kota
            //     buylcld_outcode : detail.buylcld_Outcode

            // }
            
            // fetch(url, {
            //     method: "POST",
            //     body: JSON.stringify(payload),
            //     json: true,
            //     headers :
            //         {
            //             "Content-type":"application/json; charset-UTF-8"
            //         }
            //     })
            //     .then(response => {
            //         if (response.ok) {
            //             this.findOutletPrincipal()
            //             console.log("data Deleted")

            //             this.clearChecked()
            //         }
            //     });               
        })}

       

        // this.setState({
        //     deleteData : []            
        // })           
        
    }


    render(){
        return(            
            <div >           
                <FormGroup row style={{paddingLeft : 20}}>
                    <Label sm={2} >Divisi</Label>
                    <Col sm={10} style={{display : 'flex', paddingTop : 8}}>
                    <FormGroup check style={{paddingLeft : 30}}>
                        <Label check>
                            <Input type="radio" name="radio1" onClick={()=> this.setDivisi(1)}/>{' '}
                            APOTIK
                        </Label>
                        </FormGroup>
                    <FormGroup check style={{marginLeft : 50}}>
                        <Label check>
                            <Input type="radio" name="radio1" onClick={()=> this.setDivisi(2)}/>{' '}
                            FLOOR
                        </Label>
                    </FormGroup>                       
                    </Col>                        
                </FormGroup>
                <FormGroup row style={{paddingLeft : 20} } >
                <Label sm={2}>Principal</Label>
                    <Col sm={10} style={{display : 'flex'}}>
                        <Input  style={{width : '100px'}} disabled ={true} placeholder ={this.state.principalId}></Input>
                        
                        <Input style={{width : '500px'}} disabled ={true} placeholder ={this.state.principalName}></Input>
                        <Button size = 'sm'style = {{background: "#349F9B", border: "#349F9B", borderRadius:"8px", marginLeft : 5}} onClick={()=> this.toggleFindPrincipal()} disabled = {this.state.divisi == ''}>?</Button>
                        {/* <Input type="email" name="email" id="exampleEmail" placeholder={a} /> */}
                    </Col>
                </FormGroup>
                <FormGroup row style={{paddingLeft : 20}}>
                    <Label sm={2}>Supplier</Label>
                        <Col sm={10} style={{display : 'flex'}}>
                            <Input  style={{width : '100px'}} disabled ={true} placeholder ={this.state.supId}></Input>
                            <Input style={{width : '500px'}} disabled ={true} placeholder ={this.state.supName}></Input>
                            <Button size = 'sm'style = {{background: "#349F9B", border: "#349F9B", borderRadius:"8px", marginLeft : 5}} onClick={()=> this.toggleSupplier()} disabled = {this.state.divisi == '' || this.state.principalId == ''}>?</Button>
                            
                            {/* <Input type="email" name="email" id="exampleEmail" placeholder={a} /> */}
                        </Col>
                </FormGroup> 

                <Modal size = 'lg'isOpen={this.state.findPrincipalModal} toggle={()=> this.toggleFindPrincipal()} className={this.props.className}>
                    <ModalHeader toggle={()=> this.toggleFindPrincipal()}>Pilih Principal</ModalHeader>
                    <ModalBody>
                        <FormGroup row style ={{marginTop : 10}} >
                            <Label sm={2} style ={{marginRight : 0, paddingLeft : 35}} >Find By</Label>
                            <Col sm={10} style={{display : 'flex'}}>
                            <ButtonDropdown isOpen={this.state.dropdownOpen}  toggle={()=>this.toggleDropDown()}>
                                <DropdownToggle caret size = 'sm'style = {{background: "#349F9B", border: "#349F9B", borderRadius:"8px"}}>
                                    {this.state.dropdown}
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem  onClick={()=>this.setDropDown('Kode')}>Kode</DropdownItem>
                                    <DropdownItem  onClick={()=>this.setDropDown('Name')}>Name</DropdownItem>
                                </DropdownMenu>
                            </ButtonDropdown>
                                {/* <input  disabled ={this.state.dropdown === ''} style={{width : '100%', marginLeft : 3}}  type="text" value={this.state.value} onChange={this.handleChange} /> */}
                                <Input  disabled ={this.state.dropdown === ''} 
                                    style={{width : '100%', marginLeft : 3}}  
                                    type="text" value={this.state.value} 
                                    onChange={this.handleChange} />
                                <Button size = 'sm'style = {{background: "#349F9B", border: "#349F9B", borderRadius:"8px", marginLeft : 10}} 
                                    disabled ={this.state.value === '' || this.state.loading} onClick={()=>{this.findPrincipal(); this.loading()}}
                                >
                                {this.state.loading && <i><GoSync></GoSync></i>}
                                {this.state.loading === false && 'Find'  } 
                                
                                </Button>
                                
                            </Col>
                        </FormGroup>
                        {
                            !this.state.principalData   &&
                            <Alert color="danger" style ={{textAlign : "center"}}>
                                No Data
                            </Alert>
                        }
                        {
                            this.state.principalData &&

                            <Table bordered >
                            {this.state.principalData.map((detail,index)=>{
                                return <tbody style = {{textAlign: 'center'}}>
                                        <tr key={index}>
                                            <td style ={{width : "20%"}}>{detail.Pri_Code}</td>
                                            <td style ={{width : "60%"}}>{detail.Pri_Name}</td>
                                            <td style ={{width : "20%"}}>
                                            <Button  size = 'sm'style = {{background: "#349F9B", border: "#349F9B", borderRadius:"8px"}} onClick={()=>{this.getPrincipalDetail(detail.Pri_Code, detail.Pri_Name);this.toggleFindPrincipal()}}>{this.props.buttonLabel}Select</Button>
                                            </td>
                                        </tr>                            
                                    </tbody>
                                })}
                            </Table> 
                        }
                        
                        
                    </ModalBody>
                    <ModalFooter>
                        <Button size = 'sm'style = {{background: "#F8A151", border: "#F8A151", borderRadius: "8px" }} onClick={()=>this.toggleFindPrincipal()}>Batalkan</Button>
                    </ModalFooter>
                </Modal>

                <SupplierModal
                    data ={this.state.supplierData}
                    supplierModal = {this.state.supplierModal}
                    onItemClick={this.getSupplierDetail}
                    modalClose={this.modalClose}
                ></SupplierModal>

                <h5 style = {{fontWeight:'bold', marginTop : 10}}>OUTLET YANG ADA DI PEMBELIAN LOKAL PRINCIPAL TERSEBUT</h5>
                <Table bordered style = {{textAlign: 'center'}}>
                    <thead>
                        <tr>
                            <th>Outcode</th>
                            <th>Comco</th>
                            <th>Nama Outlet</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    {this.state.outletData.map((detail,index)=>{
                        return <tbody>
                                <tr key={index}>
                                    
                                    <td>{detail.buylcld_Outcode}</td>
                                    <td>{detail.out_Comco}</td>
                                    <td>{detail.out_Name}</td>
                                    <td>
                                    {/* <Button disabled = {this.state.Edit} size = 'sm' color="danger" onClick={()=>{this.toggleDeleteOutlet(); this.setDeleteOutlet(detail.buylcld_Outcode)}}>{this.props.buttonLabel}Delete</Button> */}
                                    <Input type = "checkbox"  name="checkbox" 
                                        value ={detail.buylcld_Outcode}
                                        // onChange={ ()=>{this.handleCheckedDelete(); this.findProdukPrincipal(detail.buylcld_Outcode)} }
                                        onChange={ ()=>{this.handleCheckedDelete(); this.setOutcode()} }
                                    ></Input>
                                    </td>
                                </tr>                            
                            </tbody>
                        })}
                </Table> 
                
                <FormGroup check>
                    <Label check >
                        <Input type="checkbox" id="chkAll" name="checkAll" onChange={ ()=>{this.handleChecked() }}  />{' '}
                        Select All
                    </Label>
                </FormGroup> 
                
                
                <h5 style = {{fontWeight:'bold', marginTop : 10}}>PRODUK PEMBELIAN LOKAL DI PRINCIPAL TERSEBUT</h5>
                <div style={{display : "flex"}}>
                <Table bordered style={{width : 10}}>
                    <thead style = {{textAlign: 'center'}}>
                        <tr>
                            <th>Outcode</th>
                        </tr>
                    </thead>

                    {this.state.buylcld_Outcode.map((v,index)=>{ 
                        return <tbody style = {{textAlign: 'center'}}>
                                <tr key={index}>
                                    <td >{<Button size = "sm" color="light" style ={{background  : "white", color : "black",border : "white"}}
                                        onClick ={()=> this.findProdukPrincipal(v.buylcld_Outcode)}
                                    >{v.buylcld_Outcode}</Button>}</td>                                  
                                </tr>                            
                            </tbody>
                        })}
                </Table> 
                
                
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

                    {this.state.produkData.map((detail,index)=>{ 
                        return <tbody style = {{textAlign: 'center', fontSize : "14px"}}>
                                <tr key={index}>
                                    <td>{detail.buylcld_Procod}</td>
                                    <td>{detail.pro_Name}</td>
                                    <td>{detail.buylcld_Supcode}</td>
                                    <td>{detail.sup_Name}</td>
                                    <td>{detail.buylclh_Lgbupri}</td>
                                    <td>{detail.buylclh_Disc}</td>
                                    <td>{detail.buylclh_Lnbupri}</td>
                                    <td>{detail.buylclh_Hja}</td>
                                    <td>{detail.buylclh_Margin}</td>
                                </tr>                            
                            </tbody>
                        })}
                </Table> 

                

                </div>

                <Button size= 'sm' onClick={()=> this.selectAllProduct()}>Select all product</Button>
                
                
                <Row style = {{display: 'flex', justifyContent: 'center'}}>
                    <Button size = 'sm'style = {{background: "#349F9B", border: "#349F9B", borderRadius:"8px"}} onClick={()=>{this.toggleDeleteOutlet();this.setDeleteOutlet()}}>Delete</Button>
                    <Button size = 'sm'style = {{background: "#F8A151", border: "#F8A151", borderRadius: "8px", marginLeft: 5}}onClick={this.props.closeModal} >Exit</Button>
                </Row>

                <Modal isOpen={this.state.deleteModal} toggle={()=> this.toggleDeleteOutlet()} className={this.props.className}>
                    <ModalHeader toggle={()=> this.toggleDeleteOutlet()}>Delete Confirmation</ModalHeader>
                    <ModalBody>
                    <p>anda yakin menghapus data berikut ?</p>
                    <Table bordered >
                    <thead style = {{textAlign: 'center'}}>
                        <tr>
                        <th>Outcode</th>                       
                        </tr>
                    </thead>

                    {this.state.deleteData.map((detail,index)=>{
                        return <tbody style = {{textAlign: 'center'}}>
                                <tr key={index}>
                                    <td>{detail.buylcld_Outcode}</td>
                                </tr>                            
                            </tbody>
                        })}
                </Table> 
                       
                    </ModalBody>
                    <ModalFooter>
                        <Button size ="sm" color="primary" style = {{background: "#349F9B", border: "#349F9B", borderRadius: "8px" }} onClick={()=> this.confirmDeleteOulet()}>Hapus</Button>{' '}
                        <Button size ="sm" color="secondary" style = {{background: "#F8A151", border: "#F8A151", borderRadius: "8px" }} onClick={()=>this.toggleDeleteOutlet()}>Batalkan</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}



export default DeletePrincipal;