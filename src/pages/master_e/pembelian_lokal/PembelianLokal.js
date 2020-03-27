import React from 'react'
import Page from 'components/Page';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Alert , Input, Form, FormGroup, Label, TabContent, TabPane, Nav, NavItem, NavLink,  Row, Col, ButtonGroup, Button, Modal, ModalHeader, ModalBody, ModalFooter, Table} from 'reactstrap';
import classnames from 'classnames';
import HistoryReceive from './HistoryReceive';
import ProductModal from './ProductModal';
import SupplierModal from './Supplier';
import KotaModal from './KotaModal'
import DetailHarga from './DetailHarga'
import SearchOutlet from '../m_jenis_outlet/SearchOutlet'
import DeletePrincipal from './DeletePrincipal'
import DeleteOutlet from './DeleteOutlet'
import AddModal from './AddModal'



class PembelianLokal extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            sizes: {},
            activeTab: '1',
            modalDelete: false,
            modalEditAdd: false,
            modalEditDelete:false,
            state: false,
            modalCancel : false,
            rSelected : 0,
            additionOutlet: [],
            outletBaru : [],
            initialOutletBaru : [],
            deleteOutlet: [],
            listOutlet : [],
            Edit : true,
            historyData : [],
            initialHistoryData : [],
            lokalData : [],
            masterData : [],
            productPackData : [],
            productData : [],
            initialProductData: [],
            supplierData : [],
            kotaData : [],
            principalData : [],
            nonSaveData : [],
            
            modalKota : false,
            modalSave : false,
            supplierModal : false,
            productModal : false,
            deleteAllModal : false,
            deletePrincipalModal : false,
            modalDeleteListOutlet : false,

            supId : '',
            supName : '',
            prodId : '',
            prodName : '',
            kotaId: '',
            kotaName : '',
            edit : true,
            
            lokalGross : '',
            lokalDisc : '',
            lokalNetto : '',
            lokalHja : '',
            lokalMargin : '',
            
            masterGross : '',
            masterDisc : '',
            masterNetto : '',
            masterHja : '',
            masterMargin : '',
            
            buypack : '',
            sellPack : '',
            pro_Sellunit : '',
            moving_Status : '',
            pro_Ctrlcode : '',
            buylclh_Qtypomin : '',
            buylclh_Kelipatan : '',
            
            outNamaKota : '',
            outComco : '',
            outCode : '',
            outAddres : '',
            
            del_Id : '',
            del_Kota : '',
            del_listOutletID : '',
            del_listOutletKota :'',
           
            out_code : '',
            out_name : '',
            
            newGross : '',
            newDisc : '',
            newNetto : '',
            newHja : '',
            newMargin : '',
            newQty :'',
            newKelipatan :'',

            dropdownOpen : false,
            dropdown : ''

        }
        // this.toggleModal = this.toggleModal.bind(this);
        this.toggleTab = this.toggleTab.bind(this);
        this.toggleAddEdit = this.toggleAddEdit.bind(this);
        this.toggleDelete = this.toggleDelete.bind(this);

        this.toggleCancel = this.toggleCancel.bind(this);
        this.toggleSave = this.toggleSave.bind(this);
    }

    //toggle tab
    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
          this.setState({
            activeTab: tab
          });
        }
    }

    setModal(){
        this.setState({state: true})
    }

      //fetching data
    componentDidMount = () => {

        // var supplier = `http://10.0.111.54:8086/cariSupplier`

        // fetch(supplier)
        // .then(blob => blob.json() )
        // .then((data) => {
        //     data = data.filter((v) => {
        //         return v.supName !== '';
        //     });
        //     console.log('lokal data : ' +data);

        //     this.setState({
        //         supplierData : data
        //         ,initialSupplierResult: data
        //     });
        // });     
        
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
                ,initialSupplierResult: data.Data
            });
        });     
        
        
    }

    setSupplierModal=()=>
    {
        this.setState({
            supplierModal : true,

        })
    }
    setProductModal=()=>{
        this.setState({
            productModal : true
        })
    }

    getSupplierDetail=(supId,supName)=>{
        this.setState({
            supId : supId,
            supName : supName,
            supplierModal : false,
            Edit : true,
            prodId : '',
            prodName : '',
            kotaId : '',
            kotaName : '',
            lokalData : [],
            masterData : [],
            productPackData : [],
            listOutlet : [],
            lokalGross : '',
            lokalDisc : '',
            lokalNetto : '',
            lokalHja : '',
            lokalMargin : '',
            newGross : '',
            newDisc : '',
            newNetto : '',
            newHja : '',
            newMargin : '',
            masterGross : '',
            masterDisc : '',
            masterNetto : '',
            masterHja : '',
            masterMargin : '',
            buypack : '',
            sellPack : '',
            pro_Sellunit : '',
            moving_Status : '',
            pro_Ctrlcode : '',
            buylclh_Qtypomin : '',
            buylclh_Kelipatan : '',
            outNamaKota : '',
            outComco : '',
            outCode : '',
            outAddres : ''


        },()=>{
            this.requestDataProduk()
        })
    }

    requestDataProduk=()=>{
        // let url = `http://10.0.111.52:8086/cariProduk/${this.state.supId}`;
        let url = `https://api.docnet.id/CHCMasterE/cariProduk/${this.state.supId}`;
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
                return v.buylcld_Procod !== '';
            });

            let newData = data
            this.setState({
                productData: newData
            });

        });

    }


    getProductDetail=(prodId, prodName)=>{
        this.setState({
            prodId : prodId,
            prodName : prodName,
            productModal : false
        },()=> {
            //this.requestDataKota();
            this.requestHargaLokal();
            this.requestHargaMaster();
            this.requestProductPack();
            this.requestListOutlet();
        })
    }

    requestDataKota=()=>{
        // var url = `http://10.0.111.54:8089/cariKota/${this.state.prodId}/${this.state.supId}`;
        var url = `https://api.docnet.id/CHCAuth/cariKota/${this.state.prodId}/${this.state.supId}`;

        fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            buylcld_procod : this.state.prodId,
            buylcld_supcode : this.state.supId
        })
        })
        .then(blob => blob.json() )
        .then((data) => {
            data = data.filter((v) => {
                return v.kota_Name !== '';
            });
            console.log('kota :' + data)
            let newData = data

            this.setState({
                kotaData: newData
            });

        });
    }

    requestHargaLokal=()=>{
        
        // var url = `http://10.0.111.52:8086/lihatHargaLokal/${this.state.prodId}`;
        var url = `https://api.docnet.id/CHCMasterE/lihatHargaLokal/${this.state.prodId}`;

        fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            buylclh_procod : this.state.prodId
        })
        })
        .then(blob => blob.json() )
        .then((data) => {
            data = data.filter((v) => {
                return v.buylclh_Procod !== '';
            });
            console.log('lokal data ')
            console.log(data)
            
            let newData = data

            this.setState({
                lokalData: newData
            },()=>{
                this.setHargaLokal()
                
            });
        });
    }

    requestHargaMaster=()=>{
        // var url = `http://10.0.111.208:8093/ProductSupplier?show=saleprice`;
        var url = `https://api.docnet.id/CHCMasterProdukSupplier/ProductSupplier?show=saleprice`;


        var newData = [] 

        fetch(url)
        .then(blob => blob.json() )
        .then((data) => {
            
            console.log(data)            
            
            newData = data.data  
                     
            newData = newData.filter((v) => {
                if(v.procode === this.state.prodId){
                    return v.pro_grossprice,
                        v.pro_discount,v.pro_nettprice,
                        v.pro_saleprice, v.pro_stsmargin
                }
            });
            console.log(newData);

            this.setState({
                masterData : newData
                
            },()=>{
                this.setHargaMaster()
            });
        }); 
    }

    
    
    requestProductPack=()=>{
        var url  =  `https://api.docnet.id/CHCMasterE/showPack/${this.state.prodId}/${this.state.supId}`
        fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            buylcld_procod : this.state.prodId,
            buylcld_supcode : this.state.supId

        })
        })
        .then(blob => blob.json() )
        .then((data) => {
            try {
                console.log(data)
                data = data.filter((v) => {
                    return v.buyPack !== '';
                });
                let newData = data
                
                this.setState({
                    productPackData: newData
                },()=>{
                    this.setProductPack()
                });
                
            } catch (error) {
                this.setState({productPackData: []}) 
            }
           
        });
        
    }

    requestListOutlet=()=>{
        
         var url  =  `https://api.docnet.id/CHCMasterE/ListOutlet/${this.state.prodId}/${this.state.supId}`
         fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                buylcld_procod : this.state.prodId,
                buylcld_supcode : this.state.supId

            })
            })
            .then(blob => blob.json() )
            .then((data) => {
                try {
                    console.log(data)
                    data = data.filter((v) => {
                        return v.out_Code !== '';
                    });
    
                    let newData = data
                    
                    this.setState({
                        listOutlet: newData
                    });
                } catch (error) {
                    this.setState({listOutlet:[]})
                }
               
            });
    }

    

    // findData=()=>{

    //     this.requestListOutlet();
    //     this.setHargaLokal();
    //     this.setProductPack();

    //     var nama, id
    //     { this.state.kotaData.map((detail) =>{
    //         return nama = detail.kota_Name,
    //         id = detail.sup_Citycode

    //     })}

    //     //set table harga master
    //     var mGross, mDisc, mNetto, mHja, mMargin
    //     { this.state.masterData.map((detail) =>{
    //         return mGross = detail.pro_Grossprice,
    //         mDisc = detail.pro_Discount,
    //         mNetto = detail.pro_Nettprice,
    //         mHja = detail.pro_Saleprice,
    //         mMargin = detail.pro_Salemargin

    //     })}

    //     this.setState({
    //         kotaId : id,
    //         kotaName : nama,
    //         masterGross : mGross,
    //         masterDisc : mDisc,
    //         masterNetto : mNetto,
    //         masterHja : mHja,
    //         masterMargin : mMargin
   
    //     })
    // }

    setHargaMaster=()=>{

            this.requestListOutlet();
            // this.setHargaLokal();
            // this.setProductPack();
    
            // var nama, id
            // { this.state.kotaData.map((detail) =>{
            //     return nama = detail.kota_Name,
            //     id = detail.sup_Citycode
    
            // })}
    
            //set table harga master
            var mGross, mDisc, mNetto, mHja, mMargin
            { this.state.masterData.map((detail) =>{
                return mGross = detail.pro_grossprice,
                mDisc = detail.pro_discount,
                mNetto = detail.pro_nettprice,
                mHja = detail.pro_saleprice,
                mMargin = detail.pro_stsmargin
    
            })}
    
            this.setState({
                // kotaId : id,
                // kotaName : nama,
                masterGross : mGross,
                masterDisc : mDisc,
                masterNetto : mNetto,
                masterHja : mHja,
                masterMargin : mMargin
       
            })
        }

    setHargaLokal=()=>{

        console.log('set harga lokal')
        let gross,disc, netto, hja, margin
        { this.state.lokalData.map((detail) =>{
            return gross = detail.buylclh_Lgbupri,
            disc = detail.buylclh_Disc,
            netto = detail.buylclh_Lnbupri,
            hja = detail.buylclh_Hja,
            margin = detail.buylclh_margin

        })}

        this.setState({
            lokalGross : gross,
            lokalDisc : disc,
            lokalNetto : netto,
            lokalHja : hja,
            lokalMargin : margin

        });
        
    }

    setProductPack=()=>{

        //set table product pack
        var buypack, sellPack, moving_Status, pro_Sellunit, pro_Ctrlcode, buylclh_Qtypomin, buylclh_Kelipatan
        { this.state.productPackData.map((detail) =>{
            return buypack      = detail.pack_Name_BuyPack, 
            sellPack            = detail.pack_Name_SellPack, 
            moving_Status       = detail.moving_Status, 
            pro_Sellunit        = detail.pro_Sellunit, 
            pro_Ctrlcode        = detail.pro_Ctrlcode,
            buylclh_Qtypomin    = detail.buylclh_Qtypomin,
            buylclh_Kelipatan   = detail.buylclh_Kelipatan

        })}

        this.setState({
            buypack         : buypack, 
            sellPack        : sellPack,
            moving_Status   : moving_Status,
            pro_Sellunit    : pro_Sellunit,
            pro_Ctrlcode    : pro_Ctrlcode,
            buylclh_Qtypomin: buylclh_Qtypomin, 
            buylclh_Kelipatan : buylclh_Kelipatan
        })

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
    modalClose=()=>
    {
        this.setState({
            modalKota : false,
            supplierModal : false,
            productModal : false
        })
    }

    getHistoryData = () => {

        //ambil data supplier
        // var url  =  `http://10.0.111.54:8086/BridgingSupplier`
        var url  =  `https://api.docnet.id/CHCMasterE/BridgingSupplier`

        fetch('./historyReceiving.json')
        .then(blob => blob.json() )
        .then((data) => {
            data = data.filter((v) => {
                return v.No_Recv !== '';
            });
            console.log(data);
            let count = Object.keys(data).length;
            this.setState({
                historyData: data,
                initialHistoryData: data
            });
        });
    }
    setKotaModal=()=>{
        this.setState({
            modalKota : true
        })

        console.log('test')
    }

    requestAddOutletBaru=()=>{
        if(this.state.rSelected == 0)
        {

            // var url = `http://10.0.111.52:8086/FindOutlet/${this.state.prodId}/${this.state.supId}`;
            var url = `https://api.docnet.id/CHCMasterE/FindOutlet/${this.state.prodId}/${this.state.supId}`;


            fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                buylcld_procod : this.state.prodId,
                buylcld_supcode : this.state.supId
            })
            })
            .then(blob => blob.json() )
            .then((data) => {
                try {
                    data = data.filter((v) => {
                        return v.kota_Name !== '';
                    });
                    console.log('request otulet baru')
                    let newData = data
    
                    this.setState({
                        outletBaru: newData,
                        initialOutletBaru : newData
                    }, ()=>{
                        console.log(this.state.outletBaru)
                    });
                } catch (error) {
                    this.setState({outletBaru: []})
                    this.setState({initialOutletBaru: []})
                }
                
            });
        }
    }

    retrieveSearchText = (text) => {       
        
        
        if(this.state.rSelected ===1)//search by name
        {
            let newData = this.state.outletBaru.filter((detail) => {
                return detail.out_Name.toLowerCase().indexOf(text) != -1;
            });  

            this.setState({
                outletBaru: text === "" ? this.state.initialOutletBaru : newData
            });
    
        }    
        else  if(this.state.rSelected == 2)//search by code
        {
            let newData = this.state.outletBaru.filter((detail) => {
                return detail.out_Code.toLowerCase().indexOf(text) != -1;
            });

            this.setState({
                outletBaru: text === "" ? this.state.initialOutletBaru : newData 
            });
        }  
    }

    findOutletBaru=()=>{

        if(this.state.rSelected == 1)//by kode
        {
            // var url = `http://10.0.111.54:8086/findOutletByKode/${this.state.prodId}/${this.state.supId}/${this.state.out_Code}`;
            var url = `https://api.docnet.id/CHCMasterE/findOutletByKode/${this.state.prodId}/${this.state.supId}/${this.state.out_Code}`;
            
            fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                buylcld_procod : this.state.prodId,
                buylcld_supcode : this.state.supId,
                out_code : this.state.out_Code


            })
            })
            .then(blob => blob.json() )
            .then((data) => {
                data = data.filter((v) => {
                    return v.kota_Name !== '';//belum di benerin
                });

                let newData = data

                this.setState({
                    outletBaru: newData,
                    initialOutletBaru : newData
                });
            });
        }
        else if(this.state.rSelected == 2)
        {
            // var url = `http://10.0.111.54:8086/findOutletByName/${this.state.prodId}/${this.state.supId}/${this.state.out_name}`;
            var url = `https://api.docnet.id/CHCMasterE/findOutletByName/${this.state.prodId}/${this.state.supId}/${this.state.out_name}`;

            
            fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                buylcld_procod : this.state.prodId,
                buylcld_supcode : this.state.supId,
                out_name : this.state.out_name


            })
            })
            .then(blob => blob.json() )
            .then((data) => {
                data = data.filter((v) => {
                    return v.kota_Name !== '';//belum di benerin
                });

                let newData = data

                this.setState({
                    outletBaru: newData,
                    initialOutletBaru : newData
                });
            });

        }
    }

    addOutletBaru=(kode, comco, nama, namaKota, alamat)=>{

        var out_Code = kode
        var out_Comco  = comco
        var out_Name = nama
        var kota_Name = namaKota
        var out_Address = alamat


        let dataBaru = this.state.outletBaru.filter((v) => {
            //If return false, data will be filtered
            //If return true, data will be stayed
            return v.out_Code !== out_Code;
            // , v.cityName != this.state.delName;

        });


        // console.log(id, namaKota)
        const newData = [{out_Code, out_Comco,out_Name, kota_Name, out_Address}]
        // const newDataShow = [{kota_id, kota_Name}]

        this.setState({
            nonSaveData: this.state.nonSaveData.concat(newData),
            outletBaru: dataBaru
        })

        this.toggleAddEdit()
    }


    //cancel
    cancel=()=>
    {
        this.setState({
            nonSaveData: [],
            outletBaru : this.state.initialOutletBaru
        });
        this.toggleCancel()
    }

    //toggle modal
    toggleDelete() {
        
        this.setState(prevState => ({
          modalDelete: !prevState.modalDelete
        }));
    }

  

    toggleDeleteEdit=() =>{
        
    this.setState(prevState => ({
        modalEditDelete: !prevState.modalEditDelete
    }));
    }

    toggleAddEdit() {
        console.log('add edit')
    this.setState(prevState => ({
        modalEditAdd: !prevState.modalEditAdd
    }));
    }

    toggleCancel() {
        console.log('cancel')
        this.setState(prevState => ({
        modalCancel: !prevState.modalCancel
        }));
    }

    toggleDeleteListOutlet=()=>{
        this.setState(prevState => ({
            modalDeleteListOutlet: !prevState.modalDeleteListOutlet
        }));
      
    }

    toggleSave() {
        console.log('save')
      this.setState(prevState => ({
        modalSave: !prevState.modalSave
      }));
    }
    //trigger untuk enable
    setEdit=()=>{
        this.setState({Edit : false})
    }

    insertData=()=>{
        // var url = `http://10.0.111.52:8086/insertData`; 
        var url = `https://api.docnet.id/CHCMasterE/insertData`; 

        { this.state.nonSaveData.map((detail) =>{

          
            let payload={
                buylcld_procod : this.state.prodId, 
                buylcld_supcode : this.state.supId, 
                buylcld_outcode : detail.out_Code 
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
                        this.requestListOutlet()
                        this.setState({
                            nonSaveData: [],
                            Edit : true
                        });
                        
                    }
                });         
        })}
        this.toggleSave()
    }

    //  //delete data outlet
     deleteListOutlet=(_id, city)=>
     {
         console.log(_id)
         this.setState({
             del_listOutletID : _id,
             del_listOutletKota : city
         })
     }

     confirmDeleteListOulet=()=>
     {
         
         this.deletingListOutlet();
         let newData = this.state.listOutlet.filter((v) => {
             //If return false, data will be filtered
             //If return true, data will be stayed
             return v.out_Code !== this.state.del_listOutletID;
             

         });

         this.setState({
             listOutlet: newData
             // ,initialResult: this.state.initialResult.filter((v) => {
             //     return  v.city !== this.state.del_Id
             //     // , v.cityName != this.state.delName;
             // })
         });

     }

     deletingListOutlet=()=>
     {
         
        //  var url = `http://10.0.111.54:8086/deleteData/${this.state.prodId}/${this.state.supId}/${this.state.del_listOutletID}`
        var url = `https://api.docnet.id/CHCMasterE/deleteData/${this.state.prodId}/${this.state.supId}/${this.state.del_listOutletID}`
         
         var payload ={
             //id supplier, id kota
             buylcld_procod : this.state.prodId,
             buylcld_supcode : this.state.supId,
             buylcld_outcode : this.state.del_listOutletID

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
                 }
             });

             this.toggleDeleteListOutlet()
             this.setState({
                 del_listOutletID : '',
                 del_listOutletKota : ''
             })
     }


    //  delete data addition
     deleteData=(_id, city)=>
     {
         console.log(_id)
         this.setState({
             del_Id : _id,
             del_Kota : city
         },()=>{console.log(this.state.del_Id, this.state.del_Kota)})
     }

     confirmDelete=()=>
     {
         console.log('confirm')
         // this.toggleDel()
        //  this.deletingData();
         let newData = this.state.nonSaveData.filter((v) => {
             //If return false, data will be filtered
             //If return true, data will be stayed
             return v.out_Code !== this.state.del_Id;
             // , v.cityName != this.state.delName;

         });

         this.setState({
             nonSaveData: newData
             // ,initialResult: this.state.initialResult.filter((v) => {
             //     return  v.city !== this.state.del_Id
             //     // , v.cityName != this.state.delName;
             // })
         }, ()=>{
            this.toggleDeleteEdit()

         });        
         this.requestAddOutletBaru()       

     }

    toggleDeleteAll=()=>{
        this.setState(prevState => ({
            deleteAllModal: !prevState.deleteAllModal
          }));
    }

    toggleDeletePrincipal=()=>{
        this.setState(prevState => ({
            deletePrincipalModal: !prevState.deletePrincipalModal
          }));
    }
    deleteAll=()=>{
        this.setState({
            lokalGross : '',
            lokalDisc : '',
            lokalNetto : '',
            lokalHja : '',
            lokalMargin : '',
            
            masterGross : '',
            masterDisc : '',
            masterNetto : '',
            masterHja : '',
            masterMargin : '',

            buypack : '',
            sellPack : '',
            pro_Sellunit : '',
            moving_Status : '',
            pro_Ctrlcode : '',
            buylclh_Qtypomin : '',
            buylclh_Kelipatan : '',

            supName : '',
            prodName : '',
            kotaId : '',
            kotaName : '',
            lokalData : [],
            masterData : [],
            listOutlet : [],
            productPackData : []
        })
        this.deletingAll();
        this.toggleDeleteAll();
    }

    deletingAll=()=>{
        // let url = `http://10.0.111.54:8086/deleteDataMdMh/${this.state.prodId}/${this.state.supId}/${this.state.prodId}/${this.state.supId}`
        let url = `https://api.docnet.id/CHCMasterE/deleteDataMdMh/${this.state.prodId}/${this.state.supId}/${this.state.prodId}/${this.state.supId}`
        
        let payload ={
            bylcld_procod : this.state.prodId,
            bylcld_supcode : this.state.supId,
            bylclh_procod : this.state.prodId,
            bylclh_supcode : this.state.supId

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

                
            }
        });  

        this.setState({
            supId : '',
            prodId : ''
        })
        
    }


    onRadioBtnClick=(param)=>{
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

    newGross=(text)=> {
    // this.setState({value: event.value});
        this.setState({
            newGross : text
        })
        console.log(text)
    }
    newDisc=(text)=> {
        // this.setState({value: event.value});
        this.setState({
            newDisc : text
        })
        console.log(text)
    }

    newNetto=(text)=> {
    // this.setState({value: event.value});
        this.setState({
            newNetto : text
        })
        console.log(text)
    }

    newHja=(text)=> {
    // this.setState({value: event.value});
        this.setState({
            newHja : text
        })
        console.log(text)
    }
    newMargin=(text)=> {
    // this.setState({value: event.value});
        this.setState({
            newMargin : text
        })
        console.log(text)
    }

    newQty=(text)=> {
    // this.setState({value: event.value});
        this.setState({
            newQty : text
        })
        console.log(text)
    }
    newKelipatan=(text)=> {
    // this.setState({value: event.value});
        this.setState({
            newKelipatan : text
        })
        console.log(text)
    } 
    

   
    update=()=>{
        this.updateProductPack();
        this.updateHargaLokal();
    }
    updateHargaLokal=()=>{

        console.log('harga lokal')
        var gross = this.state.newGross =='' ? this.state.lokalGross : this.state.newGross;
        var disc = this.state.newDisc =='' ? this.state.lokalDisc : this.state.newDisc;
        var netto = this.state.newNetto =='' ? this.state.lokalNetto : this.state.newNetto;
        var hja = this.state.newHja =='' ? this.state.lokalHja : this.state.newHja;
        var margin = this.state.newMargin =='' ? this.state.lokalMargin : this.state.newMargin;
        
        // var url = `http://10.0.111.54:8086/updateHargaLokal`;
        var url = `https://api.docnet.id/CHCMasterE/updateHargaLokal`;
        console.log(gross)
        
        var payload ={
            buylclh_procod : this.state.prodId, 
            buylclh_supcode : this.state.supId , 
            buylclh_lgbupri : parseInt(gross),
            buylclh_disc : parseFloat(disc), 
            buylclh_lnbupri : parseInt(netto), 
            buylclh_margin : parseFloat(margin), 
            buylclh_hja: parseInt(hja)
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
                console.log("harga lokal updated");
                this.newHargaLokal();                
                
                this.setState({                    
                    Edit : true,
                    newGross : '',
                    newDisc : '',
                    newNetto : '',
                    newHja : '',
                    newMargin : ''
                })                
            }
        });

     
    }

    updateProductPack=()=>{

        console.log('produk')
        var qty = this.state.newQty =='' ? this.state.buylclh_Qtypomin : this.state.newQty;
        var kelipatan = this.state.newKelipatan =='' ? this.state.buylclh_Kelipatan : this.state.newKelipatan;
                    
        // var url = `http://10.0.111.54:8086/updateProdukPack`;
        var url = `https://api.docnet.id/CHCMasterE/updateProdukPack`;

        var payload ={
            buylclh_procod : this.state.prodId, 
            buylclh_supcode : this.state.supId, 
            buylclh_qtypomin : parseInt(qty), 
            buylclh_kelipatan : parseInt(kelipatan)
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
                console.log("product pack updated");
                this.newProductPack();                
                
                this.setState({  
                    Edit : true,                
                    newQty : '',
                    newKelipatan : ''
                })                
            }
        }); 
     

    }

    newHargaLokal=()=>{
        console.log('request harga lokal')
        // var url = `http://10.0.111.54:8086/lihatHargaLokal/${this.state.prodId}`;
        var url = `https://api.docnet.id/CHCMasterE/lihatHargaLokal/${this.state.prodId}`;

        fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            buylclh_procod : this.state.prodId
        })
        })
        .then(blob => blob.json() )
        .then((data) => {
            data = data.filter((v) => {
                return v.buylclh_Procod !== '';
            });
           
            let newData = data

            this.setState({
                lokalData: newData
            },()=>{
                this.setHargaLokal();
            });
        });
    }

    newProductPack=()=>{
        // var url  =  `http://10.0.111.52:8089/showPack/${this.state.prodId}/${this.state.supId}`
        var url  =  `https://api.docnet.id/CHCAuth/showPack/${this.state.prodId}/${this.state.supId}`

        
        fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            buylclh_procod : this.state.prodId,
            buylclh_supcode : this.state.supId

        })
        })
        .then(blob => blob.json() )
        .then((data) => {
            data = data.filter((v) => {
                return v.buyPack !== '';
            });
            let newData = data
            
            this.setState({
                productPackData: newData
            },()=>{
                this.setProductPack();
            });
        });
    }



    render(){        
        var linkStyle1;
        if (this.state.activeTab ==='1')  {
            linkStyle1 = {background: '#349F9B'}
        }
        else{
            linkStyle1 = {background: 'whitesmoke'}
        }
    
        var linkStyle2;
        if (this.state.activeTab ==='2' ) {
            linkStyle2 = {background: '#349F9B'}
        }
        else{
            linkStyle2 = {background: 'whitesmoke'}
        }
        
        var linkStyle3;
        if (this.state.activeTab ==='3' ) {
            linkStyle3 = {background: '#349F9B'}
        }
        else{
            linkStyle3 = {background: 'whitesmoke'}
        }

        return(
            <Page
                title="Pembelian Lokal"
                breadcrumbs={[{ name: 'Pembelian Lokal', active: true }]}
                className="Pembelian Lokal"
            >
                <div>
                    <Nav tabs>
                    <NavItem style ={linkStyle1} >
                        <NavLink  
                        className={classnames({ active: this.state.activeTab === '1' })}
                        onClick={() => { this.toggleTab('1'); }}
                        >
                        Master
                        </NavLink>
                    </NavItem>
                    <NavItem style = {linkStyle2}>
                        <NavLink
                        className={classnames({ active: this.state.activeTab === '2' })}
                        onClick={() => { this.toggleTab('2'); }}
                        >
                        History Receive
                        </NavLink>
                    </NavItem>
                    <NavItem style ={linkStyle3}>
                        <NavLink
                        className={classnames({ active: this.state.activeTab === '3' })}
                        onClick={() => { this.toggleTab('3'); }}
                        >
                        Outlet Pembelian Lokal
                        </NavLink>
                    </NavItem>
                    </Nav>

                    <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">          

                    <Row style = {{display: 'flex', justifyContent: 'flex-end', marginTop : 10, paddingRight: 60}}>
                        <DeleteOutlet
                        buylcld_supcode = {this.state.supId}
                        buylcld_procod = {this.state.prodId}
                        requestListOutlet ={this.requestListOutlet}                              
                        ></DeleteOutlet>

                        <Button color="danger" size = 'sm'  style = {{background: "#31807D", border: "#31807D", borderRadius:"8px", marginLeft : 5}} onClick={()=>this.toggleDeletePrincipal()}>Delete Principal</Button>
                    </Row>
                   
                    <FormGroup row style ={{marginTop : 20}} >
                            <Label sm={2}>Supplier</Label>
                            <Col sm={10} style={{display : 'flex'}}>
                                <Input  style={{width : '100px'}} disabled ={true} placeholder ={this.state.supId}></Input>
                                <Input style={{width : '80%'}} disabled ={true} placeholder ={this.state.supName}></Input>
                                <Button style = {{background: "#349F9B", border: "#349F9B", borderRadius:"8px"}} onClick={()=> this.setSupplierModal()}>?</Button>
                                {/* <Input type="email" name="email" id="exampleEmail" placeholder={a} /> */}
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                        <Label sm={2}>Product</Label>
                            <Col sm={10} style={{display : 'flex'}}>
                                <Input  style={{width : '100px'}} disabled ={true} placeholder ={this.state.prodId}></Input>
                                <Input style={{width : '80%'}} disabled ={true} placeholder ={this.state.prodName}></Input>
                                <Button  style = {{background: "#349F9B", border: "#349F9B", borderRadius:"8px"}} onClick={()=> this.setProductModal()}>?</Button>
                                {/* <Input type="email" name="email" id="exampleEmail" placeholder={a} /> */}
                            </Col>
                        </FormGroup>
                        {/* <FormGroup row>
                            <Label sm={2}>Kota</Label>
                                <Col sm={10} style={{display : 'flex'}}>
                                    <Input  style={{width : '100px'}} disabled ={true} placeholder ={this.state.kotaId}></Input>
                                    <Input style={{width : '80%'}} disabled ={true} placeholder ={this.state.kotaName}></Input>
                                    <Button style = {{background: "#349F9B", border: "#349F9B", borderRadius:"8px"}} onClick={()=> this.findData()}>Find</Button>
                                   
                                </Col>
                        </FormGroup> */}


                        <SupplierModal
                            data ={this.state.supplierData}
                            initialResult = {this.state.supplierData}
                            supplierModal = {this.state.supplierModal}
                            onItemClick={this.getSupplierDetail}
                            modalClose={this.modalClose}
                        ></SupplierModal>
                        <KotaModal
                            data ={this.state.kotaData}
                            modalKota = {this.state.modalKota}
                            onItemClick ={this.getDetailKota}
                            modalClose={this.modalClose}
                        ></KotaModal>
                        <ProductModal
                            data ={this.state.productData}
                            productModal ={this.state.productModal}
                            onItemClick={this.getProductDetail}
                            modalClose={this.modalClose}
                        ></ProductModal>


                        <DetailHarga
                            edit ={this.state.Edit}
                            dataLokal ={this.state.lokalData}                                
                            dataMaster ={this.state.masterData}
                            
                            lokalGross = {this.state.lokalGross}
                            lokalDisc ={this.state.lokalDisc}
                            lokalNetto={this.state.lokalNetto}
                            lokalHja ={this.state.lokalHja}
                            lokalMargin ={this.state.lokalMargin}
                            
                            masterGross = {this.state.masterGross}
                            masterDisc ={this.state.masterDisc}
                            masterNetto={this.state.masterNetto}
                            masterHja ={this.state.masterHja}
                            masterMargin ={this.state.masterMargin}
                            
                            handleChangeGross ={this.newGross}
                            handleChangeDisc ={this.newDisc}
                            handleChangeNetto ={this.newNetto}
                            handleChangeHja ={this.newHja}
                            handleChangeMargin ={this.newMargin}
                            handleChangeQty ={this.newQty}
                            handleChangeKelipatan ={this.newKelipatan}
                            
                            update ={this.update}
                            
                            buypack ={this.state.buypack} 
                            sellPack ={this.state.sellPack}
                            moving_Status={this.state.moving_Status} 
                            pro_Sellunit ={this.state.pro_Sellunit} 
                            pro_Ctrlcode ={this.state.pro_Ctrlcode} 
                            qty = {this.state.buylclh_Qtypomin}
                            kelipatan = {this.state.buylclh_Kelipatan}

                            

                        ></DetailHarga>                        

                        {/* <h5 style = {{fontWeight:'bold', textAlign: 'center', marginTop : 10}}>OUTLET YANG SUDAH DI PEMBELIAN LOKAL</h5>
                        <Table hover style = {{textAlign: 'center'}}>
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Kode</th>
                                    <th>Comco</th>
                                    <th>Nama</th>
                                    <th>Kota</th>
                                    <th>Alamat</th>
                             
                                </tr>
                            </thead>

                            {this.state.listOutlet.map((detail,index)=>{
                                return <tbody>
                                        <tr key={index}>
                                            <th scope="row">{index+1}</th>
                                            <td>{detail.out_Code}</td>
                                            <td>{detail.out_Comco}</td>
                                            <td>{detail.out_Name}</td>
                                            <td>{detail.kota_Name}</td>
                                            <td>{detail.out_Address}</td>
                                        </tr>
                                    </tbody>
                            })}
                        </Table>
                        <Modal isOpen={this.state.modalDeleteListOutlet} toggle={this.toggleDeleteListOutlet} className={this.props.className}>
                        <ModalHeader toggle={this.toggleDeleteListOutlet}>Delete Confirmation</ModalHeader>
                        <ModalBody>
                            apakah anda yakin?
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={()=> this.confirmDeleteListOulet()}>Yes</Button>{' '}
                            <Button color="secondary" onClick={this.toggleDeleteListOutlet}>No</Button>
                        </ModalFooter>
                        </Modal> */}

                        <div>
                        {/* <h5 style = {{fontWeight:'bold', textAlign: 'center', marginTop : 10}}>OUTLET YANG BARU AKAN DITAMBAHKAN</h5>
                        <Table hover style = {{textAlign: 'center'}}>
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Kode</th>
                                    <th>Comco</th>
                                    <th>Nama</th>
                                    <th>Kota</th>
                                    <th>Alamat</th>
                                    <th width  = '130px'>Action</th>
                                </tr>
                            </thead>


                            {this.state.nonSaveData.map((detail,index)=>{
                                return <tbody>
                                        <tr key={index.id}>
                                            <th scope="row">{index+1}</th>
                                            <td>{detail.out_Code}</td>
                                            <td>{detail.out_Comco}</td>
                                            <td>{detail.out_Name}</td>
                                            <td>{detail.kota_Name}</td>
                                            <td>{detail.out_Address}</td>
                                            <td>
                                                <Button disabled = {this.state.Edit} size = 'sm' color="danger" onClick={()=>{this.toggleDeleteEdit(); this.deleteData(detail.out_Code, detail.kota_Name)}}>Delete</Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                })}
                            </Table>
                            <Row>
                                <Col></Col>
                                <Col></Col>
                                <Col style = {{marginLeft: '775px'}}><Button color ="primary"disabled = {this.state.Edit} size = 'sm' color="danger" onClick={()=>{this.toggleAddEdit()}}>{this.props.buttonLabel}Add</Button></Col>
                            </Row>
                            <Modal size = 'lg' isOpen={this.state.modalEditAdd} toggle={this.toggleAddEdit} className={this.props.className}>
                                <ModalHeader toggle={this.toggleAddEdit}>Add Data</ModalHeader>
                                <ModalBody>
                                    <ButtonGroup style={{marginBottom : 10}}>
                                        <Button size = 'sm'color="primary" onClick={() => this.onRadioBtnClick(1)} active={this.state.rSelected === 1}>By Name</Button>
                                        <Button size = 'sm 'color="primary" onClick={() => this.onRadioBtnClick(2)} active={this.state.rSelected === 2}>By ID</Button>

                                    </ButtonGroup>
                        
                                    <SearchOutlet getSearchText={this.retrieveSearchText}></SearchOutlet>
                                    
                                    <Table style={{marginTop: 10}}>
                                    <tr>
                                        <th>No.</th>
                                        <th>Kode</th>
                                        <th>Comco</th>
                                        <th>Nama</th>
                                        <th>Kota</th>
                                        <th>Alamat</th>
                                        <th width  = '130px'>Action</th>
                                    </tr>
                                    {this.state.outletBaru.map((detail,index)=>{
                                    return <tbody>

                                        <tr key={index.id}>
                                            <th scope="row">{index+1}</th>
                                            <td>{detail.out_Code}</td>
                                            <td>{detail.out_Comco}</td>
                                            <td>{detail.out_Name}</td>
                                            <td>{detail.kota_Name}</td>
                                            <td>{detail.out_Address}</td>
                                            <td>
                                                <Button size = 'sm' onClick={()=> this.addOutletBaru(detail.out_Code, detail.out_Comco, detail.out_Name, detail.kota_Name, detail.out_Address)} >Select</Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                    })}
                                    </Table>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={this.toggleAddEdit}>Yes</Button>{' '}
                                    <Button color="secondary" onClick={this.toggleAddEdit}>No</Button>
                                </ModalFooter>
                            </Modal> */}

                            {/* modal delete additionOutlet */}
                            {/* <Modal isOpen={this.state.modalEditDelete} toggle={this.toggleDeleteEdit} className={this.props.className}>
                                <ModalHeader toggle={this.toggleDeleteEdit}>Delete Confirmation</ModalHeader>
                                <ModalBody>
                                    Are you sure to delete this data?
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={() => this.confirmDelete()}>Yes</Button>{' '}
                                    <Button color="secondary" onClick={this.toggleDeleteEdit}>No</Button>
                                </ModalFooter>
                            </Modal> */}

                            {/*
                            <Row>
                            <Col></Col>
                            <Col style = {{display: 'flex', justifyContent: 'center'}}>
                                
                                <AddModal 
                                    supId ={this.state.supId} 
                                    supName ={this.state.supName} 
                                    prodId ={this.state.prodId} 
                                    prodName ={this.state.prodName}
                                    kotaId = {this.state.kotaId}
                                    kotaName = {this.state.kotaName}
                                    
                                    
                                ></AddModal>
                                <Button style = {{marginLeft: 5}} size = 'sm' onClick = {()=>{this.setEdit();this.requestAddOutletBaru()}}>Edit</Button>{' '}
                                <Button style = {{marginLeft: 5 }}size = 'sm' onClick={this.toggleSave}>{this.props.buttonLabel}Save</Button>
                                <Button  style={{marginLeft : 5}} size = 'sm' onClick={()=> this.toggleDeleteAll()}>Delete</Button>
                                <Button  style = {{marginLeft: 5}}size = 'sm'  onClick={this.toggleCancel}>{this.props.buttonLabel}Cancel</Button>

                                    // modal save 
                                <Modal isOpen={this.state.modalSave} toggle={this.toggleSave} className={this.props.className}>
                                    <ModalHeader toggle={this.toggleSave}>Save</ModalHeader>
                                    <ModalBody>
                                        Confirm to save the data?
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={()=>this.insertData()}>Yes</Button>
                                        <Button color="secondary" onClick={this.toggleSave}>No</Button>
                                    </ModalFooter>
                                </Modal>

                                    
                                    // modal cancel 
                                <Modal isOpen={this.state.modalCancel} toggle={this.toggleCancel} className={this.props.className}>
                                    <ModalHeader toggle={this.toggleCancel}>Cancel</ModalHeader>
                                    <ModalBody>
                                        Do you really want to cancel all the data(s) that you want to input?
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={this.cancel}>Yes</Button>
                                        <Button color="secondary" onClick={this.toggleCancel}>No</Button>
                                    </ModalFooter>
                                </Modal>



                                <Modal isOpen={this.state.deleteAllModal} toggle={()=>this.toggleDeleteAll()} className={this.props.className}>
                                    <ModalHeader toggle={()=>this.toggleDeleteAll()}>Delete Confirmation</ModalHeader>
                                    <ModalBody>
                                        Anda yakin untuk menghapus data Harga Lokal ?
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={()=>this.deleteAll()}>Yakin</Button>{' '}
                                        <Button color="secondary" onClick={()=>this.toggleDeleteAll()}>Batalkan</Button>
                                    </ModalFooter>
                                </Modal>
                            </Col>
                            <Col></Col>
                            </Row> 


                            {/* <Row style = {{display: 'flex', justifyContent: 'center'}}>
                                <DeleteOutlet
                                buylcld_supcode = {this.state.supId}
                                buylcld_procod = {this.state.prodId}
                                requestListOutlet ={this.requestListOutlet}
                                
                                ></DeleteOutlet>
                                <Button color="danger" size = 'sm'  style={{marginLeft : 5}} onClick={()=>this.toggleDeletePrincipal()}>Delete Principal</Button>


                            {/* <Modal size = 'xl' isOpen={this.state.deletePrincipalModal} toggle={()=>this.toggleDeletePrincipal()} className={this.props.className} backdrop ={'static'} keyboard ={false}>
                                <ModalHeader toggle={()=>this.toggleDeletePrincipal()}>Delete Principal</ModalHeader>
                                <ModalBody>
                                    <DeletePrincipal></DeletePrincipal>
                                </ModalBody>
                            </Modal> 
                            </Row> */}

                            <ButtonDropdown style = {{marginTop : 10}}direction="right" size = 'sm' isOpen={this.state.dropdownOpen}  toggle={()=>this.toggleDropDown()}>
                                <DropdownToggle caret size = 'sm'style = {{background: "#349F9B", border: "#349F9B", borderRadius:"8px"}}>
                                    Select Outlet {this.state.dropdown}
                                </DropdownToggle>
                                <DropdownMenu>
                                {this.state.listOutlet.map((detail)=>{
                                   return <DropdownItem onClick={()=>console.log(detail.out_Name, detail.out_Code)}>{detail.out_Name} - {detail.out_Code}</DropdownItem>
                                })}
                                
                                    {/* <DropdownItem onClick={()=>this.setDropDown('Kode')}>Kode Outlet</DropdownItem>
                                    <DropdownItem onClick={()=>this.setDropDown('Nama')}>Name Outlet</DropdownItem> */}
                                </DropdownMenu>
                            </ButtonDropdown>
                            <Row>
                                <Col style = {{display: 'flex', justifyContent: 'center', marginTop : 15}}>
                                    <AddModal 
                                        supId ={this.state.supId} 
                                        supName ={this.state.supName} 
                                        prodId ={this.state.prodId} 
                                        prodName ={this.state.prodName}
                                        kotaId = {this.state.kotaId}
                                        kotaName = {this.state.kotaName}
                                    ></AddModal>
                                    <Button style = {{marginLeft: 5, background: "#349F9B", border: "#349F9B", borderRadius:"8px"}} size = 'sm' onClick = {()=>{this.setEdit()}}>Edit</Button>{' '}
                                    <Button  style={{marginLeft : 5, background: "#349F9B", border: "#349F9B", borderRadius:"8px"}} size = 'sm' onClick={()=> this.toggleDeleteAll()}>Delete</Button>
                                </Col>
                            </Row>
                            
                            <Row style = {{display: 'flex', justifyContent: 'center'}}>
                                {/* <DeleteOutlet
                                buylcld_supcode = {this.state.supId}
                                buylcld_procod = {this.state.prodId}
                                requestListOutlet ={this.requestListOutlet}                                
                                ></DeleteOutlet>

                                <Button color="danger" size = 'sm'  style = {{background: "#349F9B", border: "#349F9B", borderRadius:"8px", marginLeft : 5}} onClick={()=>this.toggleDeletePrincipal()}>Delete Principal</Button>
                                 */}
                                <Modal size = 'xl' isOpen={this.state.deletePrincipalModal} toggle={()=>this.toggleDeletePrincipal()} className={this.props.className} backdrop ={'static'} keyboard ={false}>
                                    <ModalHeader toggle={()=>this.toggleDeletePrincipal()}>Delete Principal</ModalHeader>
                                    <ModalBody>
                                        <DeletePrincipal closeModal ={this.toggleDeletePrincipal}></DeletePrincipal>
                                    </ModalBody>
                                    <ModalFooter>
                                        {/* <Button color="primary" onClick={()=>this.toggleDeletePrincipal()}>Yakin</Button>{' '}
                                        <Button color="secondary" onClick={()=>this.toggleDeletePrincipal()}>Batalkan</Button> */}
                                    </ModalFooter>
                                </Modal>

                                
                                <Modal isOpen={this.state.deleteAllModal} toggle={()=>this.toggleDeleteAll()} className={this.props.className}>
                                    <ModalHeader toggle={()=>this.toggleDeleteAll()}>Delete Confirmation</ModalHeader>
                                    <ModalBody>
                                        Anda yakin untuk menghapus produk dari supplier {this.state.supId} ?
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" style = {{background: "#349F9B", border: "#349F9B"  }}onClick={()=>this.deleteAll()}>Yakin</Button>{' '}
                                        <Button color="secondary" style = {{background: "#F8A151", border: "#F8A151"  }} onClick={()=>this.toggleDeleteAll()}>Batalkan</Button>
                                    </ModalFooter>
                                </Modal>
                            </Row>
                            
                        </div>
                    </TabPane>
                    <TabPane tabId="2">
                        <HistoryReceive data ={this.state.historyData}></HistoryReceive>
                    </TabPane>


                    <TabPane tabId="3">  
                        <h5 style = {{fontWeight:'bold', textAlign: 'center', marginTop : 10}}>OUTLET YANG SUDAH DI PEMBELIAN LOKAL</h5>
                        <Table hover style = {{textAlign: 'center'}}>
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Kode</th>
                                    <th>Comco</th>
                                    <th>Nama</th>
                                    <th>Kota</th>
                                    <th>Alamat</th>
                             
                                </tr>
                            </thead>

                            {this.state.listOutlet.map((detail,index)=>{
                                return <tbody>
                                        <tr key={index}>
                                            <th scope="row">{index+1}</th>
                                            <td>{detail.out_Code}</td>
                                            <td>{detail.out_Comco}</td>
                                            <td>{detail.out_Name}</td>
                                            <td>{detail.kota_Name}</td>
                                            <td>{detail.out_Address}</td>
                                        </tr>
                                    </tbody>
                            })}
                        </Table>
                        <Modal isOpen={this.state.modalDeleteListOutlet} toggle={this.toggleDeleteListOutlet} className={this.props.className}>
                        <ModalHeader toggle={this.toggleDeleteListOutlet}>Delete Confirmation</ModalHeader>
                        <ModalBody>
                            apakah anda yakin?
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={()=> this.confirmDeleteListOulet()}>Yes</Button>{' '}
                            <Button color="secondary" onClick={this.toggleDeleteListOutlet}>No</Button>
                        </ModalFooter>
                        </Modal>

                        <div>
                        <h5 style = {{fontWeight:'bold', textAlign: 'center', marginTop : 10}}>OUTLET YANG BARU AKAN DITAMBAHKAN</h5>
                        <Table hover style = {{textAlign: 'center'}}>
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Kode</th>
                                    <th>Comco</th>
                                    <th>Nama</th>
                                    <th>Kota</th>
                                    <th>Alamat</th>
                                    <th width  = '130px'>Action</th>
                                </tr>
                            </thead>


                            {this.state.nonSaveData.map((detail,index)=>{
                                return <tbody>
                                        <tr key={index.id}>
                                            <th scope="row">{index+1}</th>
                                            <td>{detail.out_Code}</td>
                                            <td>{detail.out_Comco}</td>
                                            <td>{detail.out_Name}</td>
                                            <td>{detail.kota_Name}</td>
                                            <td>{detail.out_Address}</td>
                                            <td>
                                                <Button disabled = {this.state.Edit} size = 'sm' color="danger" onClick={()=>{this.toggleDeleteEdit(); this.deleteData(detail.out_Code, detail.kota_Name)}}>Delete</Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                })}
                            </Table>
                            {/* <Row>
                                <Col></Col>
                                <Col></Col>
                                <Col style = {{marginLeft: '775px'}}><Button color ="primary"disabled = {this.state.Edit} size = 'sm' color="danger" onClick={()=>{this.toggleAddEdit()}}>{this.props.buttonLabel}Add</Button></Col>
                            </Row> */}
                            <Modal size = 'lg' isOpen={this.state.modalEditAdd} toggle={this.toggleAddEdit} className={this.props.className}>
                            <ModalHeader toggle={this.toggleAddEdit}>Add Data</ModalHeader>
                            <ModalBody>
                                <ButtonGroup style={{marginBottom : 10}}>
                                    <Button size = 'sm'color="primary" onClick={() => this.onRadioBtnClick(1)} active={this.state.rSelected === 1}>By Name</Button>
                                    <Button size = 'sm 'color="primary" onClick={() => this.onRadioBtnClick(2)} active={this.state.rSelected === 2}>By ID</Button>

                                </ButtonGroup>
                                {/* <p>selected {this.state.rSelected}</p> */}

                                <SearchOutlet getSearchText={this.retrieveSearchText}></SearchOutlet>
                                {/* <Button onClick={()=> this.requestAddOutletBaru()}>find</Button> */}

                                <Table style={{marginTop: 10}}>
                                <tr>
                                    <th>No.</th>
                                    <th>Kode</th>
                                    <th>Comco</th>
                                    <th>Nama</th>
                                    <th>Kota</th>
                                    <th>Alamat</th>
                                    <th width  = '130px'>Action</th>
                                </tr>
                                {this.state.outletBaru.map((detail,index)=>{
                                return <tbody>

                                    <tr key={index.id}>
                                        <th scope="row">{index+1}</th>
                                        <td>{detail.out_Code}</td>
                                        <td>{detail.out_Comco}</td>
                                        <td>{detail.out_Name}</td>
                                        <td>{detail.kota_Name}</td>
                                        <td>{detail.out_Address}</td>
                                        <td>
                                            <Button size = 'sm' onClick={()=> this.addOutletBaru(detail.out_Code, detail.out_Comco, detail.out_Name, detail.kota_Name, detail.out_Address)} >Select</Button>
                                        </td>
                                    </tr>
                                </tbody>
                                })}
                                </Table>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onClick={this.toggleAddEdit}>Yes</Button>{' '}
                                <Button color="secondary" onClick={this.toggleAddEdit}>No</Button>
                            </ModalFooter>
                            </Modal>

                            {/* modal delete additionOutlet */}
                            <Modal isOpen={this.state.modalEditDelete} toggle={this.toggleDeleteEdit} className={this.props.className}>
                                <ModalHeader toggle={this.toggleDeleteEdit}>Delete Confirmation</ModalHeader>
                                <ModalBody>
                                    Are you sure to delete this data?
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={() => this.confirmDelete()}>Yes</Button>{' '}
                                    <Button color="secondary" onClick={this.toggleDeleteEdit}>No</Button>
                                </ModalFooter>
                            </Modal>

                            <Row>
                            <Col></Col>
                            <Col style = {{display: 'flex', justifyContent: 'center', marginTop : 15}}>
                                {/* <Button  size = 'sm' onClick={()=>this.toggleAdd()} >Add</Button>{' '} */}
                               
                                <Button color ="primary" size = 'sm' style={{background: "#349F9B", border: "#349F9B", borderRadius:"8px"}} onClick={()=>{this.toggleAddEdit(); this.requestAddOutletBaru()}}>{this.props.buttonLabel}Add</Button>
                                <Button style = {{marginLeft: 5,background: "#349F9B", border: "#349F9B", borderRadius:"8px" }}size = 'sm' onClick={this.toggleSave}>{this.props.buttonLabel}Save</Button>
                                <Button  style={{marginLeft : 5, background: "#349F9B", border: "#349F9B", borderRadius:"8px"}} size = 'sm' onClick={()=> this.toggleDeleteAll()}>Delete</Button>
                                <Button  style = {{marginLeft: 5, background: "#349F9B", border: "#349F9B", borderRadius:"8px"}}size = 'sm'  onClick={this.toggleCancel}>{this.props.buttonLabel}Cancel</Button>

                                    {/* modal save */}
                                <Modal isOpen={this.state.modalSave} toggle={this.toggleSave} className={this.props.className}>
                                    <ModalHeader toggle={this.toggleSave}>Save</ModalHeader>
                                    <ModalBody>
                                        Confirm to save the data?
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={()=>this.insertData()}>Yes</Button>
                                        <Button color="secondary" onClick={this.toggleSave}>No</Button>
                                    </ModalFooter>
                                </Modal>

                                    
                                    {/* modal cancel */}
                                <Modal isOpen={this.state.modalCancel} toggle={this.toggleCancel} className={this.props.className}>
                                    <ModalHeader toggle={this.toggleCancel}>Cancel</ModalHeader>
                                    <ModalBody>
                                        Do you really want to cancel all the data(s) that you want to input?
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={this.cancel}>Yes</Button>
                                        <Button color="secondary" onClick={this.toggleCancel}>No</Button>
                                    </ModalFooter>
                                </Modal>



                            </Col>
                            <Col></Col>
                            </Row>


                            
                        </div>
                    </TabPane>
                    </TabContent>
                    
                </div>
            </Page>
        )
    }
}

export default PembelianLokal;