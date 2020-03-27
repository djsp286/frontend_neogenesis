import React from 'react'
import SupplierModal from './SupplierModal'
import Page from 'components/Page';
import { Pagination, PaginationItem, PaginationLink, Alert, Button, Modal, ModalHeader, ModalBody, ModalFooter, Table} from 'reactstrap';
import { MdDeleteForever, MdDoneAll, MdRemoveCircleOutline  } from "react-icons/md";
import { TiDocumentAdd, TiCancelOutline } from "react-icons/ti";



class BridgingSupplierKota extends React.Component{

    
    constructor(props) {
        super(props);
        this.state = {
            supplierResult : [],
            initialSupplierResult : [],
            result: [],
            initialResult: [],
            addModal : false,
            delModal : false,
            dataCount : '',
            nonSaveData : [],
            nonSaveDataShow:[],
            supCode : '',
            supName : '',
            supAddress : '',
            del_Id :'',
            del_Kota : '',
            delSup_Id : '',
            resultAdd : [],
            initialResultAdd: [],
            covsupp_userid : '0',
            dataPage : [],
            SupPage : 1,
            tombol : '',
            dataSup: '',
            responseData: '',
            next : false,
            saveModal : false,
            saveVisible : false,
            delVisible : false,

            //untuk pagination add data
            page: -1,
            totalShown:25,
            totalPages: -1
        };

    }

    getPageSupplier=()=>{       
        if(this.state.SupPage == 1)
        {
            // var url = `http://10.0.111.66:8086/BridgingSupplierPage`; 
            var url = `https://api.docnet.id/CHCMasterE/BridgingSupplierPage`; 

                let payload={
                    page :this.state.SupPage, //page ke berapa,
                    length :3
                }
                console.log(payload)
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
                            console.log("data request");
                            this.getDataSupplier()
                            // this.getAddData(this.state.supCode)
                            
                            
                        }
                    });

        }
        if(this.state.tombol == 'prev')
        {
            console.log('prev page')
            this.setState({
                SupPage : this.state.SupPage - 1
            },()=>{
                console.log('pagePrev : '+this.state.SupPage)
                // var url = `http://10.0.111.66:8086/BridgingSupplierPage`;
                var url = `https://api.docnet.id/CHCMasterE/BridgingSupplierPage`; 
 
                let payload={
                    page :this.state.SupPage, //page ke berapa,
                    length :2
                }
                console.log(payload)
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
                            console.log("data request");
                            this.getDataSupplier()
                            // this.getAddData(this.state.supCode)
                            
                            
                        }

                    });
            })

        }
        if(this.state.tombol == 'next')
        {
            console.log('next page')
            this.setState({
                SupPage : this.state.SupPage + 1
            },()=>{
                console.log('pageNext : '+this.state.SupPage)
                // var url = `http://10.0.111.66:8086/BridgingSupplierPage`; 
                var url = `https://api.docnet.id/CHCMasterE/BridgingSupplierPage`; 

                let payload={
                    page :this.state.SupPage, //page ke berapa,
                    length :2
                }
                console.log(payload)
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
                            console.log("data request");
                            this.getDataSupplier()
                            // this.getAddData(this.state.supCode)
                            
                            
                        }
                        
                        
                    });
            })
        }
    }

    setButton=(klik)=>
    {
        var button = klik

        if(button == 'prev')
        {
            this.setState({
                tombol : button
            },()=>{
                this.getPageSupplier()
            })

        }
        if(button == 'next')
        {
            this.setState({
                tombol : button
            },()=>{
                this.getPageSupplier()
            })
        }
    }

    getDataSupplier=()=>{
        // var url  =  `http://10.0.111.66:8086/BridgingSupplierPage`
        // fetch(url)
        // .then(blob => blob.json() )
        // .then((data) => {
        //     data = data.filter((v) => {
        //         return v.covSupp_Name !== '';
        //     });
        //         console.log("next/prev-datalaod"+data);

        //         let newData = data
        //         // let count = Object.keys(data).length;
        //         this.setState({
        //             supplierResult: newData,
        //             initialSupplierResult: newData
        //         });
        //     });   
            
        // var url = `http://10.0.111.66:8086/BridgingSupplierPage`; 
        var url = `https://api.docnet.id/CHCMasterE/BridgingSupplierPage`; 


        fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            page :this.state.SupPage, //page ke berapa,
            length :2
        })
        })
        .then(blob => blob.json() )
        .then((data) => {
            data = data.filter((v) => {
                return v.covSupp_Name !== '';
            });
            console.log('data yang di ambil ' +data)
                if(data =='')
                {
                    
                    this.setState({
                        next : true,
                        SupPage : this.state.SupPage-1
                    })
                    
                }
                else {
                    console.log("next/prev-datalaod"+data);

                    let newData = data
                    // let count = Object.keys(data).length;
                    this.setState({
                        next : false,
                        supplierResult: newData,
                        initialSupplierResult: newData
                    });
                }                
        });     
 }
   

    //ambil data ke modal add
    getAddData=()=>
    {   
        
        // var url = `http://10.0.111.66:8086/BridgingSupplierKota2/${this.state.supCode}`
        var url = `https://api.docnet.id/CHCMasterE/BridgingSupplierKota2/${this.state.supCode}`

          
        //filter data yang sudah masuk ke nonShowdata
        var a 
        { this.state.nonSaveDataShow.map((detail) =>{
            a = detail.kota_id
        })}

        fetch(url)
        .then(blob => blob.json() )
        .then((data) => {
            data = data.filter((v) => {
                return v.kota_name !== '';
            });
            console.log(data);
            this.setState({
                resultAdd: data.filter((v)=>{
                    return v.kota_id !== a
                }),
                initialResultAdd: data.filter((v)=>{
                    return v.kota_id !== a
                })
            },()=>{
                this.setState({            
                    page : 1,
                    totalPages: Math.ceil(this.state.resultAdd.length / this.state.totalShown)
                },()=> console.log(this.state.totalPages))
            });
        }); 
    } 

    //untuk pagination di halaman add kota
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
            totalShown : 2,
            totalPages : Math.ceil(this.state.resultAdd.length / this.state.totalShown)
        });

        console.log('Page : ' +this.state.page)
        console.log('total show : ' + this.state.totalShown)
        console.log('total pages : ' + this.state.totalPages)
    }
    //masukin data ke array dan ke tampilan utama
    addData=(kota_id, kota_Name)=>
    {
        var covsupp_supcode = this.state.supCode
        var covsupp_userid  = this.state.covsupp_userid
        var covsupp_kota = kota_id
        // console.log(id, namaKota)
        const newData = [{covsupp_kota,covsupp_supcode, covsupp_userid}]
        const newDataShow = [{kota_id, kota_Name}]
       
        this.setState({
            nonSaveData: this.state.nonSaveData.concat(newData),
            nonSaveDataShow : this.state.nonSaveDataShow.concat(newDataShow)
        })
       
        this.toggleAdd() 
    }

    addNewData = ()  => {
        // var url = `http://10.0.111.66:8086/AddBridge`; 
        var url = `https://api.docnet.id/CHCMasterE/AddBridge`; 
        { this.state.nonSaveData.map((detail) =>{

          
            let payload={
                covsupp_kota : detail.covsupp_kota,
                covsupp_supcode : detail.covsupp_supcode,
                covsupp_userid : '0'
            }


            console.log(payload)
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
                        console.log("data inserted");
                        // this.getAddData(this.state.supCode)
                        this.getDataKota(this.state.supCode)
                        this.setState({
                            nonSaveDataShow: [],
                            saveVisible : true
                            
                        });
                        
                    }
                });
                
            
        })}
    }
    onDismiss=()=>{
        this.setState({
            
            saveVisible : false
        })
    }
    onDismissDelete=()=>{
        this.setState({
            
            delVisible : false
        })
    }
    cancel=()=>
    {
        this.setState({
            SupPage : 0,
            nonSaveDataShow : [],
            nonSaveData : []
        });
    }

    cancelNonSave=(kode)=>
    {
        let newData = this.state.nonSaveData.filter((v)=>
        {
            return v.covsupp_kota !== kode
        });

        let newDataShow = this.state.nonSaveDataShow.filter((v) => {
            //If return false, data will be filtered
            //If return true, data will be stayed
            return v.kota_id !== kode
            // , v.namaKota != kota;
            
        });

        this.setState({
            nonSaveDataShow: newDataShow,
            nonSaveData : newData
        });
    }
    

    toggleAdd=()=>
    {
        this.setState(prevState => ({
            addModal: !prevState.addModal
          }));
    }
   
    toggleSave=()=>
    {
        this.setState(prevState => ({
            saveModal: !prevState.saveModal
          }));
    }

    toggleDel=()=>
    {
        this.setState(prevState => ({
            delModal: !prevState.delModal
          }));
    }

    deleteData=(id, kota)=>
    {   
        console.log(id)
        this.setState({
            del_Id : id,
            del_Kota : kota
        })

    }

    confirmDelete=()=>
    {
        // this.toggleDel()
        this.deletingData(this.state.del_Id);
        let newData = this.state.result.filter((v) => {
            //If return false, data will be filtered
            //If return true, data will be stayed
            return v.kota_id !== this.state.del_Id;
            // , v.cityName != this.state.delName;
            
        });

        this.setState({
            result: newData,
            dataCount : newData.length,
            initialResult: this.state.initialResult.filter((v) => {
                return  v.covSupp_Kota !== this.state.del_Id
                // , v.cityName != this.state.delName;
            })
        });

        this.toggleDel()
    }

    deletingData=(param1)=>
    {
        console.log(param1,this.state.supCode)
        // var url = `http://10.0.111.66:8086/DeleteBridge`;
        var url = `https://api.docnet.id/CHCMasterE/DeleteBridge`;
        var payload ={
            //id supplier, id kota
            covsupp_kota : param1,
            covsupp_supcode : this.state.supCode
            
        }
        console.log(param1,this.state.supCode)
        console.log(url);

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
                    this.setState({
                        delVisible : true
                    })
                }
            });

            this.toggleDel();
            this.setState({
                del_Id : ''
            })
    }


    supplierDetail=(Code, Name, address)=>{

        this.setState({
            supCode : Code,
            supName : Name,
            supAddress : address,
            SupPage : 1,//set page langsung ke halaman 1
            nonSaveDataShow : []
        }, ()=> 
            {
                console.log(this.state.supCode)
                //ambil data kota
                this.getDataKota(this.state.supCode)
            }
        );

    }

    modalClose=()=>
    {
        this.setState({
            SupPage : 0
        })
    }

    getDataKota=(Code)=>
    {
        // var url = `http://10.0.111.66:8086/BridgingSupplier/${Code}`
        // var url = `http://10.0.111.66:8086/BridgingSupplierKota1/${Code}`
        var url = `https://api.docnet.id/CHCMasterE/BridgingSupplierKota1/${Code}`
                  
        fetch(url)
        .then(blob => blob.json() )
        .then((data) => {
            data = data.filter((v) => {
                return v.kota_name !== '';
            });
            console.log(data);
            let count = Object.keys(data).length;
            this.setState({
                result: data,
                initialResult: data,
                dataCount : count
            });
        }); 
    }
   

    render(){  
        //untuk pagination tampilan add data 
        let startData = (this.state.page - 1) * this.state.totalShown;
        let endData = this.state.page * this.state.totalShown;
        
        return(
            <Page
                title="Bridging Supplier Kota"
                breadcrumbs={[{ name: 'Bridging Supplier Kota', active: true }]}
                className="BridgingSupplierKota"
            >
                <SupplierModal modalClose={this.modalClose}next = {this.state.next} supplierClick ={this.getPageSupplier}page ={this.state.SupPage} data ={this.state.supplierResult} onItemClick={this.supplierDetail} Pagination ={this.setButton} ></SupplierModal>
                <hr></hr>         
                {   
                    this.state.supCode =='' && 
                    <div>
                        <Alert color="info">
                            Select Supplier to Show Data
                        </Alert>

                    </div>

                }
                {
                    (!this.state.supCode =='') && 
                    <div>
                        <Alert color="info" style={{textAlign : "center"}}>
                            {
                                'Kode Supplier : '+ this.state.supCode + ' | '+
                                'Nama Supplier : '+ this.state.supName + ' | '+
                                'Alamat : '+this.state.supAddress 

                            }
                        </Alert>
                         <Table hover>
                            <thead>
                                <tr>
                                    <th style={{width: '100px', textAlign: 'center'}}>#</th>
                                    <th style={{width: '150px', textAlign: 'center'}}>Kode Kota</th>
                                    <th style={{width: '600px', textAlign: 'center'}}>Nama Kota</th>
                                    <th style={{width: '300px', textAlign: 'center'}}>Action</th>
                                </tr>
                            </thead>
                            
                            { this.state.result.map((detail,index) =>{
                            return <tbody>
                                    <tr key={index.id} >
                                        <th style={{textAlign: 'center'}}scope="row">{index+1}</th>
                                        <td style={{textAlign: 'center'}}>{detail.kota_id}</td>
                                        <td style={{textAlign: 'center'}}>{detail.kota_name}</td>
                                        <td style={{textAlign: 'center'}}>
                                            <Button color="danger" size = 'sm' onClick={()=> {this.toggleDel();this.deleteData(detail.kota_id, detail.kota_Name) }}><MdDeleteForever style={{width: 20, height: 20, paddingBottom : 2}}></MdDeleteForever></Button>
                                        </td>
                                    </tr>                            
                                </tbody>
                        
                            })}
                        </Table>
                        <Table hover > 
                           
                        
                        { this.state.nonSaveDataShow.map((detail,index) =>{
                            return <tbody>
                                            <tr key={index.id}>
                                                <th style={{width: '80px', textAlign: 'center'}} scope="row">{this.state.dataCount+index+1}</th>
                                                <td style={{width: '150px', textAlign: 'center'}}>{detail.kota_id}</td>
                                                <td style={{width: '530px', textAlign: 'center'}}>{detail.kota_Name}</td>
                                                <td style={{width: '280px', textAlign: 'center'}}>
                                                    <Button  color = 'warning'size = 'sm' onClick={()=>this.cancelNonSave(detail.kota_id)}><MdRemoveCircleOutline style={{width: 20, height: 20, paddingBottom : 2}}></MdRemoveCircleOutline></Button>
                                                </td>
                                            </tr>            
                                </tbody>
                        
                            })}

                        </Table>
                        <Alert color="info" isOpen={this.state.saveVisible} toggle={()=>this.onDismiss()}>
                            Data inserted
                        </Alert>
                        <Alert color="danger" isOpen={this.state.delVisible} toggle={()=>this.onDismissDelete()}>
                            Data deleted
                        </Alert>
                        
                        <br></br>
                        <Button onClick ={()=> {this.toggleAdd();this.getAddData()}} color = 'primary'><TiDocumentAdd style={{width: 20, height: 20, paddingBottom : 2}}></TiDocumentAdd> Add</Button>{' '}
                        <Button color = 'success' disabled ={this.state.nonSaveDataShow== ''}onClick={()=> this.toggleSave()}><MdDoneAll style={{width: 20, height: 20, paddingBottom : 2}}></MdDoneAll> Save</Button>{' '}
                        <Button  color = 'warning' disabled ={this.state.nonSaveDataShow== ''} onClick={()=> this.cancel()}><TiCancelOutline style={{width: 20, height: 20, paddingBottom : 2}}></TiCancelOutline> Cancel</Button>

                        <Modal size = 'lg'isOpen={this.state.addModal} toggle={()=> this.toggleAdd()} className={this.props.className}>
                            <ModalHeader toggle={this.toggle}>Add Data</ModalHeader>
                            <ModalBody>
                                <Table bordered>
                                    <thead>
                                        <tr>
                                            <th style={{textAlign: 'center', width: "10%"}}>#</th>
                                            <th style={{textAlign: 'center', width: "30%"}}>Kode Kota</th>
                                            <th style={{textAlign: 'center', width: "40%"}}>Nama Kota</th>
                                            <th style={{textAlign: 'center', width: "20%"}}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.resultAdd.map((detail, i) =>  
                                            startData <= i && i < endData &&
                                            <tr key={i}>
                                                <td style={{textAlign: 'center'}} scope="row" >{i+1}</td>
                                                <td style={{textAlign: 'center'}} >{detail.kota_id}</td>
                                                <td style={{textAlign: 'center'}}>{detail.kota_name}</td> 
                                                <td style={{textAlign: 'center'}}>
                                                    <Button color = 'success'size = 'sm' style = {{background: "#349F9B" , border : "#349F9B"}} onClick={()=> this.addData(detail.kota_id, detail.kota_name)}>Add</Button>
                                                </td>     
                                                
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>

                                <Pagination >
                                    <PaginationItem disabled={this.state.page == 1} onClick={() => this.prevPage()}>
                                        <PaginationLink >Prev</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem disabled={(this.state.page == this.state.totalPages) || (this.state.totalShown > 5)} >
                                        <PaginationLink  onClick={() => this.nextPage()}>Next</PaginationLink>
                                    </PaginationItem>                                                      
                                </Pagination>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="secondary" style={{background: "#F8A151", border: "#F8A151"}} onClick={()=> this.toggleAdd()}>Cancel</Button>
                            </ModalFooter>
                        </Modal>

                        <Modal isOpen={this.state.saveModal} toggle={()=> this.toggleSave()} className={this.props.className}>
                            <ModalHeader toggle={this.toggle}>Konfirmasi Penyimpanan</ModalHeader>
                            <ModalBody>
                                <p>Anda yakin akan menyimpan data berikut ini?</p>
                            <Table bordered >  
                                <thead>
                                    <tr>
                                        <th style={{textAlign: 'center'}}>#</th>
                                        <th style={{textAlign: 'center'}}>Kode Kota</th>
                                        <th style={{ textAlign: 'center'}}>Nama Kota</th>
                                    </tr>
                                </thead>    
                        
                                { this.state.nonSaveDataShow.map((detail,index) =>{
                                    return <tbody>
                                                    <tr key={index.id}>
                                                        <th style={{ textAlign: 'center'}} scope="row">{index+1}</th>
                                                        <td style={{ textAlign: 'center'}}>{detail.kota_id}</td>
                                                        <td style={{ textAlign: 'center'}}>{detail.kota_Name}</td>
                                                    </tr>            
                                        </tbody>
                                
                                    })}

                            </Table>
                                
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary"   style ={{background: "##349F9B", border: "##349F9B"}} onClick={()=>{this.toggleSave(); this.addNewData()}}>Simpan</Button>{' '}
                                <Button color="secondary" style ={{background: "#F8A151", border: "#F8A151"}} onClick={()=>this.toggleSave()}>Batalkan</Button>
                            </ModalFooter>
                        </Modal>
                        <Modal isOpen={this.state.delModal} toggle={()=> this.toggleDel()} className={this.props.className}>
                            <ModalHeader toggle={this.toggleDel}>Hapus Data</ModalHeader>
                            <ModalBody>
                               Data yang akan dihapus  {' \n[Id : ' + this.state.del_Id + ' | Kota : ' + this.state.del_Kota + ']' } 
                            </ModalBody>
                            <ModalFooter>
                                <Button color="secondary" style={{background: "#E84C4C", border: "#E84C4C"}} onClick={() => {this.confirmDelete();this.toggleDel()}}>Hapus</Button>{' '}
                                <Button color="primary"   style={{background: "#F8A151", border: "#F8A151"}} onClick={() => this.toggleDel()}>Batalkan</Button>
                            </ModalFooter>
                        </Modal>
                    </div>
                }
            </Page>
        )
    }
}

export default BridgingSupplierKota;