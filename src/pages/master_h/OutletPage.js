import Page from 'components/Page';
import React from 'react';
import * as api from './api';
// import DatePicker from "react-datepicker";
// import DayPicker from 'react-day-picker';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Input,
  Label,
  InputGroup,
  InputGroupAddon,
  Form,
  Collapse,
  FormGroup,
  InputGroupText,
  UncontrolledTooltip,
} from 'reactstrap';
import InputMask from 'react-input-mask';
import {
  MdSearch,
  MdLoyalty,
  MdWifiTethering,
  MdExpandLess,
  MdVisibility,
  MdExpandMore,
  MdMoreVert,
  MdModeEdit,
  MdDelete,
  MdDehaze,
  MdCheckBox,
  MdAdd,
  MdCall,
  MdWarning,
} from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';

const hostUrl = 'https://api.docnet.id/CHCMasterH/MasterOutlet';
class OutletPage extends React.Component {
  //special method
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      resultKota: [],
      resultEye: [],
      resultTelp: [],

      outlets: [],
      JenisScheduleROs: [],
      JenisAreas: [],
      JenisStockTakes: [],
      JenisDepositBatchs: [],
      JenisClassSpecials: [],
      JenisKepemilikans: [],
      Kotas: [],

      resultJenisScheduleROContents: [],
      resultBridgingServer: [],
      isLoading: false,
      inputtedName: '',
      inputtedName2: '',
      inputTelp: '',
      currentPage: 0,
      todosPerPage: 5,
      flag: 0,
      totalPage: '',
      collapse: false,
      value: '',
      buttonSimpanEdit: true,
      dateOpenValueEdit: false,
      dateCloseValueEdit: false,
      disabledAlamatOutlet: true,
      disabledcitycode: true,
      disabledpostalcode: true,
      mdWarning: 'd-none',
      hidePagination: 'flex-row',
    };
    this.toggleCollapseMore = this.toggleCollapseMore.bind(this);
    this.toggleCollapseLess = this.toggleCollapseLess.bind(this);

    this.toggleCollapseMoreBody = this.toggleCollapseMoreBody.bind(this);
    this.toggleCollapseLessBody = this.toggleCollapseLessBody.bind(this);
  }

  componentDidMount() {
    this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
  }

  onChangeValuePPNTelpon = () => {
    var checkboxValuePPNTelp = document.getElementById('idPPNTelpon');
    var telpPPNInput = document.getElementById('telpPPN');

    if (checkboxValuePPNTelp.checked === true) {
      telpPPNInput.style.visibility = true;
      console.log(this.idPPNTelpon + 'true');
    } else {
      telpPPNInput.visible = false;
      console.log(this.idPPNTelpon + 'false');
    }
  };

  //mask
  onChangeMask = event => {
    var value = event.target.value;
    var newState = {
      mask: '9999-9999-9999-9999',
      npwp: value,
    };
    if (/^3[47]/.test(value)) {
      newState.mask = '9999-999999-99999';
    }
    this.setState(newState);
  };

  //fungsi notification
  showNotification = currMessage => {
    setTimeout(() => {
      if (!this.notificationSystem) {
        return;
      }
      this.notificationSystem.addNotification({
        title: <MdLoyalty />,
        message: currMessage,
        level: 'info',
      });
    }, 100);
  };

  // ----------------------------------------------- PAGINATION SHOW ALL DATA --------------------------------------------------------- EDITED BY RICHARD & DANIEL & KRIS

  //Memberikan semua list data pada page tersebut dimana diBack end mempunyai data Current limit maupun Current Page
  getListbyPaging(currPage, currLimit) {
    var url = api.url_tampildataOutlet(currPage, currLimit);
    this.isLoading = true;
    fetch(url)
      .then(response => response.json())
      .then(data =>
        this.setState({
          result: data.content,
          isLoading: false,
          totalPage: data.totalPages,
        }),
      );
  }

  checkboxJaminYN() {
    //tombol
    var checkJaminYNed = document.getElementById('checkJaminYN');

    //inputan
    var inputJaminYNed = document.getElementById('inputJaminYN');

    if (checkJaminYNed.checked === true) {
      inputJaminYNed.style.display = 'none';
    }
  }

  getListBridgingServer(outcode) {
    var url = api.url_bridgingServer(outcode);
    // this.isLoading = true;
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.log('RESPONSE NOT FOUND');
        }
      })
      .then(data => {
        this.setState({
          resultBridgingServer: data,
          isLoading: false,
          totalPage: data.totalPages,
        });
      })
      .catch(() => {
        console.log('ERROR BOSQ');
      });
  }
  getListbyEye(outcode) {
    var url = api.url_tampilDetailDataOutlet(outcode);
 this.getTableForInputEdit();
    this.isLoading = true;
    fetch(url)
      .then(response => response.json())
      .then(
        data =>
          this.setState({
            resultEye: data.content,
            out_names: data.content[0].out_name,
            resultEyeout_code: data.content[0].out_code,
            out_name: data.content[0].jnsarea_name,
            jenisoutlet: data.content[0].jnsout_name,
            resultEyeout_square: data.content[0].out_square,
            out_address: data.content[0].out_address,
            out_citycode: data.content[0].out_citycode,
            postalcode: data.content[0].out_postalcode,
            resultEyeout_luasgudang: data.content[0].out_luasgudang,
            resultEyeout_luasareajualan: data.content[0].out_luasareajualan,
            dateopen: new Date(data.content[0].out_dateopen)
              .toISOString()
              .substr(0, 10),
            dateclose: new Date(data.content[0].out_dateclose)
              .toISOString()
              .substr(0, 10),


              
            out_jnssttk: data.content[0].out_jnssttk,
            out_timeclose: data.content[0].out_timeclose,
            out_email: data.content[0].out_email,
            out_fax: data.content[0].out_fax,
            jeniskepemilikan: data.content[0].jnsmlk_name,
            resultEyepicda_nip: data.content[0].picda_nip,
            resultEyePicDaNama: data.content[0].picda_nama,
            resultEyeout_npwp: data.content[0].out_npwp,
            out_jnsarea: data.content[0].out_jnsarea,
            resultEyeout_npwppph: data.content[0].out_npwppph,
            resultEyeout_jnsdeposit: data.content[0].depb_name,
            resultEyeout_schedulero: data.content[0].out_schedulero,
            out_jenisoutlet: data.content[0].out_jenisoutlet,
            resultEyeout_schedulerosenin: data.content[0].schedule_ro_senin,
            resultEyeout_scheduleroselasa: data.content[0].schedule_ro_selasa,
            resultEyeout_schedulerorabu: data.content[0].schedule_ro_rabu,
            resultEyeout_schedulerokamis: data.content[0].schedule_ro_kamis,
            resultEyeout_schedulerojumat: data.content[0].schedule_ro_jumat,
            resultEyeout_schedulerosabtu: data.content[0].schedule_ro_sabtu,
            out_jeniskepemilikan: data.content[0].out_jeniskepemilikan,
            resultEyeout_jaminyn: data.content[0].out_jaminyn,
          
            out_allowcredityn:data.content[0].out_allowcredityn,
            out_perjanjianyn:data.content[0].out_perjanjianyn,
            out_camerayn:data.content[0].out_camerayn,

            resultEyeout_jaminynKet: data.content[0].out_jaminket,
            out_jnsdeposit: data.content[0].out_jnsdeposit,
            resultEyeinsout_name: data.content[0].out_jaminyn,
            resultEyeout_class: data.content[0].out_class,
            resultEyespecial_nama: data.content[0].special_nama,
            out_schedulero: data.content[0].out_schedulero,
            resultEyejumlahpc: data.content[0].out_jumpc,
            resultEyeout_robotgdyn: data.content[0].out_robotgdyn,
            jenisstocktake: data.content[0].jenis_sttk,
            out_classspecial: data.content[0].out_classspecial,
            out_class: data.content[0].out_class,
            out_jumpc: data.content[0].out_jumpc,
          
            isLoading: false,
            totalPage: data.totalPages,


            ronaldo: this.resultEyeRonaldo(data.content[0].out_robotgdyn),
            test: this.resultEyeJaminCheck(data.content[0].out_jaminyn),
            senin: this.resultEyeScheduleSenin(data.content[0].schedule_ro_senin),
          selasa: this.resultEyeScheduleSelasa(
            data.content[0].schedule_ro_selasa,
          ),
          rabu: this.resultEyeScheduleRabu(data.content[0].schedule_ro_rabu),
          kamis: this.resultEyeScheduleKamis(data.content[0].schedule_ro_kamis),
          jumat: this.resultEyeScheduleJumat(data.content[0].schedule_ro_jumat),
          sabtu: this.resultEyeScheduleSabtu(data.content[0].schedule_ro_sabtu),
            

          gudangYN:this.gudangYN(data.content[0].out_robotgdyn),
          allowCredit:this.allowCredit(data.content[0].out_allowcredityn),
          allowPerjanjian:this.allowPerjanjian(data.content[0].out_perjanjianyn),
          allowCamera:this.allowCamera(data.content[0].out_camerayn),
          modal_view: true,
          }),
        console.log(this.state.out_allowcredityn + 'out_allowcredityn'),  
      );
  }

  getListbyEdit(outcode) {
    this.getTableForInputEdit();
    var currOpen = new Date();
    currOpen.setDate(currOpen.getDate());
    var currOpen = currOpen.toISOString().substr(0, 10);

    var url = api.url_tampilDetailDataOutlet(outcode);
this.setState({
  out_allowcredityn:'N',
  out_perjanjianyn:'N',
  out_camerayn:'N',
})
    this.isLoading = true;
    fetch(url)
      .then(response => response.json())
      .then(
        data =>
          this.setState({
            resultEye: data.content,
            out_names: data.content[0].out_name,
            resultEyeout_code: data.content[0].out_code,
            out_name: data.content[0].jnsarea_name,
            jenisoutlet: data.content[0].jnsout_name,
            resultEyeout_square: data.content[0].out_square,
            out_address: data.content[0].out_address,
            out_citycode: data.content[0].out_citycode,
            postalcode: data.content[0].out_postalcode,
            resultEyeout_luasgudang: data.content[0].out_luasgudang,
            resultEyeout_luasareajualan: data.content[0].out_luasareajualan,
            dateopen: new Date(data.content[0].out_dateopen)
              .toISOString()
              .substr(0, 10),
            dateclose: new Date(data.content[0].out_dateclose)
              .toISOString()
              .substr(0, 10),
            dateOpenValueEdit:
              new Date(data.content[0].out_dateopen)
                .toISOString()
                .substr(0, 10) < currOpen,
            dateOpenIsNull:
                new Date(data.content[0].out_dateopen)
                  .toISOString()
                  .substr(0, 10) !== null ,
            dateCloseValueEdit:data.content[0].out_dateclose!== null,
          

            out_jnssttk: data.content[0].out_jnssttk,
            out_timeclose: data.content[0].out_timeclose,
            out_email: data.content[0].out_email,
            out_fax: data.content[0].out_fax,
            jeniskepemilikan: data.content[0].jnsmlk_name,
            resultEyepicda_nip: data.content[0].picda_nip,
            resultEyePicDaNama: data.content[0].picda_nama,
            resultEyeout_npwp: data.content[0].out_npwp,
            out_jnsarea: data.content[0].out_jnsarea,
            resultEyeout_npwppph: data.content[0].out_npwppph,
            resultEyeout_jnsdeposit: data.content[0].depb_name,
            resultEyeout_schedulero: data.content[0].out_schedulero,
            out_jenisoutlet: data.content[0].out_jenisoutlet,
            out_jeniskepemilikan: data.content[0].out_jeniskepemilikan,
            resultEyeout_jaminyn: data.content[0].out_jaminyn,
          
            out_allowcredityn:data.content[0].out_allowcredityn,
            out_perjanjianyn:data.content[0].out_perjanjianyn,
            out_camerayn:data.content[0].out_camerayn,

            resultEyeout_jaminynKet: data.content[0].out_jaminket,
            out_jnsdeposit: data.content[0].out_jnsdeposit,
            resultEyeinsout_name: data.content[0].out_jaminyn,
            resultEyeout_class: data.content[0].out_class,
            resultEyespecial_nama: data.content[0].special_nama,
            out_schedulero: data.content[0].out_schedulero,


            resultEyeout_schedulerosenin: data.content[0].schedule_ro_senin,
            resultEyeout_scheduleroselasa: data.content[0].schedule_ro_selasa,
            resultEyeout_schedulerorabu: data.content[0].schedule_ro_rabu,
            resultEyeout_schedulerokamis: data.content[0].schedule_ro_kamis,
            resultEyeout_schedulerojumat: data.content[0].schedule_ro_jumat,
            resultEyeout_schedulerosabtu: data.content[0].schedule_ro_sabtu,

            resultEyejumlahpc: data.content[0].out_jumpc,
            resultEyeout_robotgdyn: data.content[0].out_robotgdyn,
            jenisstocktake: data.content[0].jenis_sttk,
            out_classspecial: data.content[0].out_classspecial,

            out_class: data.content[0].out_class,
            out_jumpc: data.content[0].out_jumpc,
       
            isLoading: false,
            totalPage: data.totalPages,


            ronaldo: this.resultEyeRonaldo(data.content[0].out_robotgdyn),
            test: this.resultEyeJaminCheck(data.content[0].out_jaminyn),
         
            senin: this.resultEyeScheduleSenin(data.content[0].schedule_ro_senin),
            selasa: this.resultEyeScheduleSelasa(
            data.content[0].schedule_ro_selasa,
          ),
          rabu: this.resultEyeScheduleRabu(data.content[0].schedule_ro_rabu),
          kamis: this.resultEyeScheduleKamis(data.content[0].schedule_ro_kamis),
          jumat: this.resultEyeScheduleJumat(data.content[0].schedule_ro_jumat),
          sabtu: this.resultEyeScheduleSabtu(data.content[0].schedule_ro_sabtu),
            
          allowCredit:this.allowCredit(data.content[0].out_allowcredityn),
          allowPerjanjian:this.allowPerjanjian(data.content[0].out_perjanjianyn),
          allowCamera:this.allowCamera(data.content[0].out_camerayn),
          
          modal_update: true,

          },()=>  console.log(
            
            
            this.state.resultEyeout_robotgdyn + 'resultEyeout_robotgdyn',
            this.state.resultEyeout_scheduleroselasa + 'resultEyeout_scheduleroselasa',
            this.state.resultEyeout_schedulerorabu + 'resultEyeout_schedulerorabu',
            this.state.resultEyeout_schedulerokamis + 'resultEyeout_schedulerokamis',
            this.state.resultEyeout_schedulerojumat + 'resultEyeout_schedulerojumat',
            this.state.resultEyeout_schedulerosabtu + 'resultEyeout_schedulerosabtu',
          
          
          )),
      
      );
  }

  resultEyeJaminCheck(jaminYN) {
    console.log(this.state.resultEyeout_jaminyn);
    if (jaminYN === 'Y') {
      this.setState({
        pjkoutyn1checked: true,
        inputEditJaminYN: false,
      });
    } else {
      this.setState({
        pjkoutyn1checked: false,
        inputEditJaminYN: true,
      });
    }
  }

  resultEyeRonaldo(jaminYN) {
    if (jaminYN === 'Y') {
      this.setState({
        resultEyeout_robotgudang: true,
        buttonSimpanEdit: false,
        out_robotgdyn: 'Y',
      });
    } else {
      this.setState({
        resultEyeout_robotgudang: false,
        buttonSimpanEdit: true,
        out_robotgdyn: 'N',
      });
    }
  }
  allowCredit(jaminYN) {
    console.log(this.state.out_allowcredityn);
    if (jaminYN === 'Y') {
      this.setState({
        out_allowcreditynChecked: true,
      });
    } else {
      this.setState({
        out_allowcreditynChecked: false,
  
      });
    }
  }
  allowPerjanjian(jaminYN) {
    console.log(this.state.out_perjanjianyn);
    if (jaminYN === 'Y') {
      this.setState({
        out_perjanjianynChecked: true,
     
      });
    } else {
      this.setState({
        out_perjanjianynChecked: false,
       
      });
    }
  }
  allowCamera(jaminYN) {
    console.log(this.state.out_camerayn0);
    if (jaminYN === 'Y') {
      this.setState({
        out_cameraynChecked: true,
        inputEditJaminYN: false,
      });
    } else {
      this.setState({
        out_cameraynChecked: false,
        inputEditJaminYN: true,
      });
    }
  }
  getTableForInputEdit() {
    var url = hostUrl+`/TampilDataPengisianOutlet`;
    // this.isLoading = true;
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.log('RESPONSE NOT FOUND');
        }
      })
      .then(data => {
        let resultJenisOutlet = data[0].JenisOutlet.map(outlet => {
          return { value: outlet.jnsout_code, display: outlet.jnsout_name };
        });
        let resultJenisScheduleRO = data[0].JenisScheduleRO.map(schedule => {
          return {
            value: schedule.rec_schedulecode,
            display: schedule.rec_schedulecode,
          };
        });
        let resultJenisStockTake = data[0].JenisStockTake.map(
          JenisStockTake => {
            return {
              value: JenisStockTake.jnssttk_code,
              display: JenisStockTake.jnssttk_name,
            };
          },
        );

        let resultJenisArea = data[0].JenisArea.map(JenisArea => {
          return {
            value: JenisArea.jnsarea_code,
            display: JenisArea.jnsarea_name,
          };
        });
        let resultJenisDepositBatch = data[0].JenisDepositBatch.map(
          JenisDepositBatch => {
            return {
              value: JenisDepositBatch.depb_id,
              display: JenisDepositBatch.depb_name,
            };
          },
        );

        let resultJenisKepemilikan = data[0].JenisKepemilikan.map(
          JenisKepemilikan => {
            return {
              value: JenisKepemilikan.jnsmlk_code,
              display: JenisKepemilikan.jnsmlk_name,
            };
          },
        );
        let resultJenisClassSpecial = data[0].JenisClassSpecial.map(
          JenisClassSpecial => {
            return {
              value: JenisClassSpecial.special_id,
              display: JenisClassSpecial.special_nama,
            };
          },
        );

        let resultKota = data[0].Kota.map(Kota => {
          return { value: Kota.kota_id, display: Kota.kota_name };
        });

        let resultJenisScheduleROContent = data[0].JenisScheduleROContent;

    
        this.setState({
          isLoading: false,
          totalPage: data.totalPages,
          outlets: [{ value: '0', display: 'Pilih Outlet' }].concat(
            resultJenisOutlet,
          ),
          JenisScheduleROs: [
            { value: '0', display: 'Pilih Schedule RO' },
          ].concat(resultJenisScheduleRO),
          JenisStockTakes: [{ value: '0', display: 'Pilih Stocktake' }].concat(
            resultJenisStockTake,
          ),
          JenisAreas: [{ value: '0', display: 'Pilih Jenis Area' }].concat(
            resultJenisArea,
          ),
          JenisDepositBatchs: [
            { value: '0', display: 'Pilih Jenis Area' },
          ].concat(resultJenisDepositBatch),
          JenisKepemilikans: [
            { value: '0', display: 'Pilih Kepemilikan' },
          ].concat(resultJenisKepemilikan),
          JenisClassSpecials: [
            { value: '0', display: 'Pilih Class Special' },
          ].concat(resultJenisClassSpecial),
          Kotas: [{ value: '0', display: 'Pilih Kota' }].concat(resultKota),

          resultJenisScheduleROContents: resultJenisScheduleROContent,
        
        });
      })
      .catch(() => {
        console.log('ERROR BOSQ');
      });
  }
  getTableForInputSelect() {
    var url = hostUrl+`/TampilDataPengisianOutlet`;
    // this.isLoading = true;
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.log('RESPONSE NOT FOUND');
        }
      })
      .then(data => {
        let resultJenisOutlet = data[0].JenisOutlet.map(outlet => {
          return { value: outlet.jnsout_code, display: outlet.jnsout_name };
        });
        let resultJenisScheduleRO = data[0].JenisScheduleRO.map(schedule => {
          return {
            value: schedule.rec_schedulecode,
            display: schedule.rec_schedulecode,
          };
        });
        let resultJenisStockTake = data[0].JenisStockTake.map(
          JenisStockTake => {
            return {
              value: JenisStockTake.jnssttk_code,
              display: JenisStockTake.jnssttk_name,
            };
          },
        );

        let resultJenisArea = data[0].JenisArea.map(JenisArea => {
          return {
            value: JenisArea.jnsarea_code,
            display: JenisArea.jnsarea_name,
          };
        });
        let resultJenisDepositBatch = data[0].JenisDepositBatch.map(
          JenisDepositBatch => {
            return {
              value: JenisDepositBatch.depb_id,
              display: JenisDepositBatch.depb_name,
            };
          },
        );

        let resultJenisKepemilikan = data[0].JenisKepemilikan.map(
          JenisKepemilikan => {
            return {
              value: JenisKepemilikan.jnsmlk_code,
              display: JenisKepemilikan.jnsmlk_name,
            };
          },
        );
        let resultJenisClassSpecial = data[0].JenisClassSpecial.map(
          JenisClassSpecial => {
            return {
              value: JenisClassSpecial.special_id,
              display: JenisClassSpecial.special_nama,
            };
          },
        );

        let resultKota = data[0].Kota.map(Kota => {
          return { value: Kota.kota_id, display: Kota.kota_name };
        });

        let resultJenisScheduleROContent = data[0].JenisScheduleROContent;


        this.setState({
          isLoading: false,
          totalPage: data.totalPages,
          outlets: [{ value: '0', display: 'Pilih Outlet' }].concat(
            resultJenisOutlet,
          ),
          JenisScheduleROs: [
            { value: '0', display: 'Pilih Schedule RO' },
          ].concat(resultJenisScheduleRO),

          JenisStockTakes: [{ value: '0', display: 'Pilih Stocktake' }].concat(
            resultJenisStockTake,
          ),
          JenisAreas: [{ value: '0', display: 'Pilih Jenis Area' }].concat(
            resultJenisArea,
          ),
          JenisDepositBatchs: [
            { value: '0', display: 'Pilih Jenis Area' },
          ].concat(resultJenisDepositBatch),
          JenisKepemilikans: [
            { value: '0', display: 'Pilih Kepemilikan' },
          ].concat(resultJenisKepemilikan),
          JenisClassSpecials: [
            { value: '0', display: 'Pilih Class Special' },
          ].concat(resultJenisClassSpecial),

          Kotas: [{ value: '0', display: 'Pilih Kota' }].concat(resultKota),

          resultJenisScheduleROContents: resultJenisScheduleROContent,
 
          modal_nested_parent: true,
        });
      })
      .catch(() => {
        console.log('ERROR BOSQ');
      });
  }

      

  clickTambah() {
    var currOpen = new Date();
    currOpen.setDate(currOpen.getDate());
    var dateClose = currOpen.toISOString().substr(0, 10);
    this.getTableForInputSelect();

    this.setState({
      postalcode: '',
      timeclose: '00:00:00',
      dateclose: dateClose,
      out_email:'',
      jnsarea:'0',
      square:'0',
      luasgudang:'0',
      luasareajualan:'0',
      jenisoutlet:'0',
      jenisstocktake:'0',
      out_jeniskepemilikan:'0',
      scheduleDeposit:'0',
      schedulero:'0',
      classspecial:'0',
  
      out_jumpc :'0',

      out_allowcredityn:'N',
      out_allowcreditynChecked:false,

      out_perjanjianyn:'N',
      out_perjanjianynChecked:false,

      out_camerayn:'N',
      out_cameraynChecked:false,

      out_jaminyn:'N',
      jaminket:'',
      jaminketDisabled :'true',
      out_fax :'',
 


    });
  }

  onChangeCredit(e) {
    var creditYNChecboxed = document.getElementById('creditYNChecbox');

    if (e.target.checked === true) {
      console.log('masukChecked + ' );
      creditYNChecboxed.checked = true;
      this.setState({
        out_allowcredityn: 'Y',
      });
    } else {
      console.log('tidakmasukChecked');
      creditYNChecboxed.checked = false;
      this.setState({
        out_allowcredityn: 'N',
      });
    }
  }
  
  onCheckChangeRonaldo(e) {
    var ronaldoYNed = document.getElementById('ronaldoYN');

    if (e.target.checked === true) {
      
      console.log('masukChecked');
      ronaldoYNed.checked = true;
      this.setState({
        buttonSimpanEdit: false,
        out_robotgdyn: 'Y',
      });
    } else {
      console.log('tidakmasukChecked');
      ronaldoYNed.checked = false;
      this.setState({
        buttonSimpanEdit: true,
        out_robotgdyn: 'N',
      });
    }
  }
 
  onCheckChange(e) {
    var ronaldoYNed = document.getElementById('ronaldoYN');

    if (e.target.checked === true) {
      
      console.log('masukChecked');
      ronaldoYNed.checked = true;
      this.setState({
        buttonSimpanEdit: false,
        out_robotgdyn: 'Y',
      });
    } else {
      console.log('tidakmasukChecked');
      ronaldoYNed.checked = false;
      this.setState({
        buttonSimpanEdit: true,
        out_robotgdyn: 'N',
      });
    }
  }
  onChangeCamera(e) {
    var cameraYNChecboxed = document.getElementById('cameraYNChecbox');

    if (e.target.checked === true) {
      console.log('masukChecked + ' );
  cameraYNChecboxed.checked = true;
      this.setState({
        out_camerayn: 'Y',
      });
    } else {
      console.log('tidakmasukChecked');
      cameraYNChecboxed.checked = false;
      this.setState({
        out_camerayn: 'N',
      });
    }
  }
  onChangePerjanjian(e) {
    var perjanjianYNChecboxed = document.getElementById('perjanjianYNChecbox');

    if (e.target.checked === true) {
      console.log('masukChecked + ' );
      perjanjianYNChecboxed.checked = true;
      this.setState({
        out_perjanjianyn: 'Y',
      });
    } else {
      console.log('tidakmasukChecked');
      perjanjianYNChecboxed.checked = false;
      this.setState({
        out_perjanjianyn: 'N',
      });
    }
  }


  onCheckJaminYN(e) {
    var jaminYNChecboxed = document.getElementById('jaminYNChecbox');
    if (e.target.checked === true) {
      console.log('masukChecked + ' );
      jaminYNChecboxed.checked = true;
    
      this.setState({
        out_jaminyn: 'Y',
        jaminketDisabled:false
        
      });
    } else {
      console.log('tidakmasukChecked');
      jaminYNChecboxed.checked = false;

      this.setState({
        out_jaminyn: 'N',
        jaminketDisabled:true
      });
    }
  }


  resultEyeScheduleSenin(param) {
    if (param === 'Y') {
      
      this.setState({
        resultEyeout_jaminynSenin: true,
      });
    } else {
      this.setState({
        resultEyeout_jaminynSenin: false,
      });
    }
    
  }

  resultEyeScheduleSelasa(param) {
    if (param === 'Y') {
      this.setState({
        resultEyeout_jaminynSelasa: true,
      });
    } else {
      this.setState({
        resultEyeout_jaminynSelasa: false,
      });
    }
  }

  resultEyeScheduleRabu(param) {
    if (param === 'Y') {
      this.setState({
        resultEyeout_jaminynRabu: true,
      });
    } else {
      this.setState({
        resultEyeout_jaminynRabu: false,
      });
    }
  }

  resultEyeScheduleKamis(param) {
    if (param === 'Y') {
      this.setState({
        resultEyeout_jaminynKamis: true,
      });
    } else {
      this.setState({
        resultEyeout_jaminynKamis: false,
      });
    }
  }

  resultEyeScheduleJumat(param) {
    if (param === 'Y') {
      this.setState({
        resultEyeout_jaminynJumat: true,
      });
    } else {
      this.setState({
        resultEyeout_jaminynJumat: false,
      });
    }
  }

  resultEyeScheduleSabtu(param) {
    if (param === 'Y') {
      this.setState({
        resultEyeout_jaminynSabtu: true,
      });
    } else {
      this.setState({
        resultEyeout_jaminynSabtu: false,
      });
    }
  }
  gudangYN(param) {
    if (param === 'Y') {
      this.setState({
        ronaldoYN: true,
      });
    } else {
      this.setState({
        ronaldoYN: false,
      });
    }
  }
  

  validationSubmit() {
    var namaOutleted = document.getElementById('namaOutlet');
    var alamatOutleted = document.getElementById('alamatOutlet');
    var kotaOutleted = document.getElementById('kotaOutlet');
    var tanggalBukaed = document.getElementById('tanggalBuka');
    var tanggalTutuped = document.getElementById('tanggalTutup');
    if (namaOutleted.value.length === 0) {
      this.showNotification('Nama Outlet Belum Diisi');
      this.setState({ modal_nested: false });
    }

    if (alamatOutleted.value.length === 0) {
      this.showNotification('Alamat Outlet Belum Diisi');
      this.setState({ modal_nested: false });
    }
    if (kotaOutleted.value.length === 0) {
      this.showNotification('Kota Outlet Belum Diisi');
      this.setState({ modal_nested: false });
    }
    if (
      tanggalTutuped.value.length > 0 &&
      kotaOutleted.value.length > 0 &&
      alamatOutleted.value.length > 0
    ) {
      this.setState({ modal_nested: true });
    }
  }
  // =====================================================

  //=====================================================

  validationSubmit2() {
    var kepemilikanOutleted = document.getElementById('kepemilikanOutlet');
    var npwpPPNed = document.getElementById('npwpPPN');
    var npwpPPH21ed = document.getElementById('npwpPPH21');
console.log(kepemilikanOutleted)
    var inputValid = []

    if (kepemilikanOutleted.value.length === 0) {
      this.showNotification('Kepemilikan Belum Diisi');
      inputValid.push(false)

    } else {
      inputValid.push(true)

    }

    if (npwpPPNed.value.length === 0) {
      this.showNotification('NPWP PPN Belum Diisi');
      inputValid.push(false)

    } else {
      inputValid.push(true)

    }

    if (npwpPPH21ed.value.length === 0) {
      this.showNotification('NPWP PPH Belum Diisi');
      inputValid.push(false)

    } else {
      inputValid.push(true)
  
    }

    if (inputValid.includes(false)) {
      this.setState({ modal_submitTambah: false });
    } else {
      this.setState({ modal_submitTambah: true });
    }
  }





  validationEdit() {
    this.setState({
      modal_nested: true,
    });
  }


  
  getListNomorTelp(outcode) {
    var url = api.url_tampildataTeleponOutlet(outcode);

    // this.isLoading = true;
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.log('RESPONSE NOT FOUND');
        }
      })
      .then(data => {
        console.log(data);
        this.setState({
          resultTelp: data,
          isLoading: false,
          totalPage: data.totalPages,
        });
      })
      .catch(() => {
        console.log('ERROR BOSQ');
      });
  }

  handleSelect(event) {
    this.setState({ [event.target.name]: event.target.value }, () => {
      this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
    });
  }

  handleWrite(event, flag) {
    if (
      this.state.currentPage + flag < 0 ||
      this.state.currentPage + flag > this.state.totalPage - 1
    ) {
      return;
    }
    this.setState(
      {
        currentPage: Number(event.target.value) + flag,
      },
      () => {
        if (flag !== 0) {
          this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
        }
      },
    );
  }

  //fungsi yang mengarah kan ke arah first page
  handleFirst(event) {
    this.setState({
      currentPage: 0,
    });
    this.getListbyPaging(0, this.state.todosPerPage);
  }

  //fungsi yang mengarah ke arah last page
  handleLast(event) {
    this.setState({
      currentPage: this.state.totalPage - 1,
    });
    this.getListbyPaging(this.state.totalPage - 1, this.state.todosPerPage);
  }

  handleClose = () => {
    this.setState({
      areacode: '',
      name: '',
      address: '',
      citycode: '',
      postalcode: '',
      out_email: '',
      square: '',
      jnsarea: '',
      luasgudang: '',
      luasareajualan: '',
      dateopen: '',
      dateclose: '',
      jenisoutlet: '',
      jeniskepemilikan: '',
      jenisstocktake: '',
      npwp: '',
      npwppph: '',
      scheduleDeposit: '',
      schedulero: '',
      class: '',
      classspecial: '',
      inputtedName2: '',
      inputTelp: '',
      collapse: false,
      buttonSimpanEdit: true,
    });
  };
  //state awal pada saat membuka suatu page tsb nanti dicari langsung di render()
  state = {
    modal: false,
    modal_backdrop: false,
    modal_nested_parent: false,
    modal_nested: false,
    modal_delete: false,
    modal_update: false,
    modal_inputtelp: false,
    modal_view: false,
    backdrop: true,
    inputtedName2: '',
    areacode: '',
    numberTelp: '',
    collapse: false,
    dropdownOpen: false,
  };

  toggleCollapseMore() {
    this.setState(state => ({ collapse: !state.collapse }));

    var expandMored = document.getElementById('expandMore');
    var expandLessed = document.getElementById('expandLess');

    expandMored.style.display = 'none';
    expandLessed.style.display = 'inline';
  }
  toggleCollapseLess() {
    this.setState(state => ({ collapse: !state.collapse }));

    var expandMored = document.getElementById('expandMore');
    var expandLessed = document.getElementById('expandLess');

    expandMored.style.display = 'inline';
    expandLessed.style.display = 'none';
  }

  //    ================================================
  toggleCollapseMoreBody() {
    this.setState(state => ({ collapse: !state.collapse }));

    var expandMored = document.getElementById('expandMoreBody');
    var expandLessed = document.getElementById('expandLessBody');

    expandMored.style.display = 'none';
    expandLessed.style.display = 'inline';
  }
  toggleCollapseLessBody() {
    this.setState(state => ({ collapse: !state.collapse }));

    var expandMored = document.getElementById('expandMoreBody');
    var expandLessed = document.getElementById('expandLessBody');

    expandMored.style.display = 'inline';
    expandLessed.style.display = 'none';
  }

  //fungsi untuk membuka suatu toggle di page tsb
  toggle = modalType => () => {
    if (!modalType) {
      return this.setState({
        modal: !this.state.modal,
      });
    }

    //pembuatan setState disemua function, dimana hanya memanggil nama nya saja ex modal_delete , maka di render hanya panggil delete saja
    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
    });
  };

  // --------------------------------------------------------- INSERT --------------------------------------------------------- EDITED BY RICHARD & DANIEL & KRISS

  //melakukan insert data dimana melempar parameter ke backend
  addOutlet = () => async () => {
    this.setState({
      isLoading: true,
    });
    var url = api.url_insertdataOutlet;
    var payload = {
      out_name: this.state.name,
      out_comco: '0',
      out_address: this.state.address,
      out_citycode: this.state.citycode,
      out_postalcode: this.state.postalcode,
      out_email: this.state.out_email,
      out_jnsarea: this.state.jnsarea,
      out_square: this.state.square,
      out_luasgudang: this.state.luasgudang,
      out_luasareajualan: this.state.luasareajualan,
      out_dateopen: this.state.dateopen,
      out_dateclose: this.state.dateclose,
      out_jenisoutlet: this.state.jenisoutlet,
      out_robotgdyn: this.state.out_robotgdyn,
      out_jeniskepemilikan: this.state.out_jeniskepemilikan,
      out_timeclose: this.state.timeclose,
      out_npwp: this.state.npwp,
      out_npwppph: this.state.npwppph,
      out_jnsdeposit: this.state.scheduleDeposit,
      out_fax:this.state.out_fax,
      out_jaminyn:this.state.out_jaminyn,
      out_jaminket: this.state.jaminket,

      out_schedulero: this.state.schedulero,
      out_class: this.state.class,
      out_classspecial: this.state.classspecial,
      out_jnssttk: this.state.jenisstocktake,
      out_jumpc: this.state.out_jumpc,
      out_buyingpower:'0',


      out_allowcredityn:this.state.out_allowcredityn,
      out_perjanjianyn:this.state.out_perjanjianyn,
      out_camerayn:this.state.out_camerayn,

      out_userid : "0",
     
    };
    console.log(JSON.stringify(payload));
    let data = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      json: true,
      body: JSON.stringify(payload),
    }).then(response => {
      if (response.ok) {
        this.state.modal_submitTambah = false;
        this.state.modal_inputtelp = false;
        this.state.inputtedName2 = '';
        this.isLoading = false;
        this.state.modal_nested = false;
        this.state.modal_nested_parent = false;
        this.componentDidMount();
        return response.json();
      }
    });
    if (data) {
      this.showNotification('Data ' + this.state.name + ' Berhasil Disimpan');
    } else {
      alert('Data ' + this.state.name + ' Sudah Pernah Ada');
    }
  };

  addTelpon = (areacode, numberTelp) => async () => {
    console.log('Masuk function');
    this.setState({ isLoading: true });
    var url = api.url_insertdataTelponOutlet;
    var payload = {
      telout_outcode: this.state.telout_outcode,
      telout_areacode: areacode,
      telout_number: numberTelp,
      telout_code: '0',
      telout_userid: '0',
      telout_ppn: '0',
      telout_ars: '0',
    };
    console.log(JSON.stringify(payload));
    let data = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      json: true,
      body: JSON.stringify(payload),
    }).then(response => {
      if (response.ok) {
        this.state.nested_citrix = false;
        this.state.numberTelp = '';
        this.state.areacode = '';
        this.state.modal_nested_tambahtelp = false;
        this.isLoading = false;
        this.state.modal_nested = false;
        this.state.modal_nested_parent = false;
        this.state.modal_nested_tambahtelp_confirm = false;
        this.state.modal_submitTambah = false;
        this.componentDidMount();
        return response.json();
      }
    });
    if (data) {
      this.getListNomorTelp(this.state.telout_outcode);
      this.showNotification('Data ' + numberTelp + ' Berhasil Disimpan');
    } else {
      alert('Data ' + numberTelp + ' Sudah Pernah Ada');
    }
  };

  //Insert state awal nya dimana tidak boleh special character dan harus semua huruf besar
  insertInputValue = evt => {
    this.setState({
      areacode: evt.target.value,
    });
  };

  insertnameValue = evt => {
    this.setState({
      disabledAlamatOutlet: false,
      name: evt.target.value.toUpperCase(),
    });
  };
  insertaddressValue = evt => {
    this.setState({
      disabledcitycode: false,
      address: evt.target.value.toUpperCase(),
    });
  };
  editaddressValue = evt => {
    this.setState({
      out_address: evt.target.value.toUpperCase(),
      buttonSimpanEdit: false,
    });
  };

  editOutletName = evt => {
    this.setState({
      buttonSimpanEdit: false,
      out_names: evt.target.value.replace(/[^\w\s]/gi, '').toUpperCase(),
    });
  };

  jaminketYN = evt => {
    this.setState({
      resultEyeout_jaminynKet: evt.target.value
        .replace(/[^\w\s]/gi, '')
        .toUpperCase(),
    });
  };

  // ================================

  insertcitycodeValue = evt => {
    this.setState({
      disabledpostalcode: false,
      buttonSimpanEdit: false,
      citycode: evt.target.value,
    });
  };
  editcitycodeValue = evt => {
    this.setState({
      buttonSimpanEdit: false,
      out_citycode: evt.target.value,
    });
  };
  // ================================

  insertpostalcodeValue = evt => {
    this.setState({
      postalcode: evt.target.value,
    });
  };

  editpostalcodeValue = evt => {
    this.setState({
      buttonSimpanEdit: false,
      postalcode: evt.target.value,
    });
  };
  // ================================

  onChangeEmail = evt => {
    this.setState({
      buttonSimpanEdit: false,
      out_email: evt.target.value,
    });
  };
  onChangeFax = evt => {
    this.setState({
      buttonSimpanEdit: false,
      out_fax: evt.target.value,
    });
  };
  
  onChangeJaminKet = evt => {
    this.setState({
      jaminket: evt.target.value,
    });
  };
  insertsquareValue = evt => {
    this.setState({
      square: evt.target.value,
    });
  };
  insertjnsareaValue = evt => {
    this.setState({
      jnsarea: evt.target.value,
      buttonSimpanEdit: false,
    });
  };

  editjnsareaValue = evt => {
    this.setState({
      out_jnsarea: evt.target.value,
      buttonSimpanEdit: false,
    });
  };
  insertluasgudangValue = evt => {
    this.setState({
      luasgudang: evt.target.value,
    });
  };
  insertluasareajualanValue = evt => {
    this.setState({
      luasareajualan: evt.target.value,
    });
  };

  handleSik2StartDateInputChange = event => {
    var currOpen = new Date();
    currOpen.setDate(currOpen.getDate() + 14);
    var dateOpen = currOpen.toISOString().substr(0, 10);

    const startDate = new Date(event.target.value);
    const endDate = new Date(dateOpen);

    console.log('SIA: StartDate: ' + startDate);
    console.log('SIA: EndDate: ' + endDate);

    try {
      if (startDate < endDate) {
        this.setState({
          mdWarning: 'inline',
          dateopen: startDate.toISOString().substr(0, 10),
          hostout_tglefektifmesinInvalid: true,
          hostout_tglefektifmesinValid: false,
          buttonSimpanEdit: false,
        });
      } else {
        this.setState({
          mdWarning: 'd-none',
          disabledtanggalTutup: false,
          dateopen: startDate.toISOString().substr(0, 10),
          hostout_tglefektifmesinInvalid: false,
          hostout_tglefektifmesinValid: true,
          disabledButtonNext: false,
          buttonSimpanEdit: true,
        });
      }
    } catch (error) {
      this.setState({
        mdWarning: 'inline',
        dateopen: startDate,
        hostout_tglefektifmesinInvalid: true,
        hostout_tglefektifmesinValid: false,
        buttonSimpanEdit: false,
      });
    }
  };

  handleSik2EndDateInputChange = event => {
    const startDate = new Date(this.state.dateopen);
    const endDate = new Date(event.target.value);

    var dateNow = new Date();

    console.log('SIA: StartDate: ' + startDate);
    console.log('SIA: EndDate: ' + endDate);

    console.log('SIA: DateNow: ' + dateNow);
    try {
      if (endDate < dateNow) {
        this.setState({
          dateclose: endDate.toISOString().substr(0, 10),
          hostout_penarikanmesinInvalid: true,
          hostout_penarikanmesinValid: false,
          disabledButtonNext: true,
        });
      } else {
        this.setState({
          dateclose: endDate.toISOString().substr(0, 10),
          hostout_penarikanmesinInvalid: false,
          hostout_penarikanmesinValid: true,
          disabledButtonNext: false,
          buttonSimpanEdit: false,
        });
      }
    } catch (error) {
      this.setState({
        dateclose: endDate,
        hostout_penarikanmesinInvalid: true,
        hostout_penarikanmesinValid: false,
        disabledButtonNext: true,
      });
    }
  };

  // ==============================
startDateInputChangeEdit = event => {
    var currOpen = new Date();
    currOpen.setDate(currOpen.getDate() + 14);
    var dateOpen = currOpen.toISOString().substr(0, 10);

    const startDate = new Date(event.target.value);
    const endDate = new Date(dateOpen);

    console.log('SIA: StartDate: ' + startDate);
    console.log('SIA: EndDate: ' + endDate);

    try {
      if (startDate < endDate) {
        this.setState({
          mdWarning: 'inline',
          dateopen: startDate.toISOString().substr(0, 10),
          dateopenInvalid: true,
          dateopenValid: false,
          buttonSimpanEdit: true,
        });
      } else {
        this.setState({
          mdWarning: 'd-none',
          disabledtanggalTutup: false,
          dateopen: startDate.toISOString().substr(0, 10),
          dateopenInvalid: false,
          dateopenValid: true,
          disabledButtonNext: false,
          buttonSimpanEdit: false,
        });
      }
    } catch (error) {
      this.setState({
        mdWarning: 'inline',
        dateopen: startDate,
        hostout_tglefektifmesinInvalid: true,
        dateopenValid: false,
        buttonSimpanEdit: true,
      });
    }
  };

  endDateInputChangeEdit = event => {
    const startDate = new Date(this.state.dateopen);
    const endDate = new Date(event.target.value);

    var dateNow = new Date();

    console.log('SIA: StartDate: ' + startDate);
    console.log('SIA: EndDate: ' + endDate);

    console.log('SIA: DateNow: ' + dateNow);
    try {
      if (endDate < dateNow) {
        this.setState({
          dateclose: endDate.toISOString().substr(0, 10),
          datecloseInvalid: true,
          datecloseValid: false,
          buttonSimpanEdit: true,
        });
      } else {
        this.setState({
          dateclose: endDate.toISOString().substr(0, 10),
          datecloseInvalid: false,
          datecloseValid: true,
          disabledButtonNext: false,
          buttonSimpanEdit: false,
        });
      }
    } catch (error) {
      this.setState({
        dateclose: endDate,
        datecloseInvalid: true,
        datecloseValid: false,
    
      });
    }
  };

  // ==============================

  insertjenisoutletValue = evt => {
    console.log(evt.target.value)
    this.setState({
      buttonSimpanEdit: false,
      jenisoutlet: evt.target.value,
    });
  };
  editjenisoutletValue = evt => {
    console.log(evt.target.value)
    this.setState({
      out_jenisoutlet: evt.target.value,
      buttonSimpanEdit: false,
    });
  };

  // ==============================

  insertjeniskepemilikanValue = evt => {
    console.log(evt.target.value)
    this.setState({
      disabledAlamatOutlet: false,
      out_jeniskepemilikan: evt.target.value,
    });
  };
  editjeniskepemilikanValue = evt => {
    console.log(evt.target.value)
    this.setState({
      buttonSimpanEdit:false,
      out_jeniskepemilikan: evt.target.value,
    });
  };

  // ==============================

  insertjenisStocktakeValue = evt => {
    console.log(evt.target.value)
    this.setState({
      jenisstocktake: evt.target.value,
    });
  };

  editjenisStocktakeValue = evt => {
    console.log(evt.target.value)
    this.setState({
      out_jnssttk: evt.target.value,
      buttonSimpanEdit: false,
    });
  };


insertJumlahPC = evt => {
  console.log(evt.target.value)
  this.setState({
    out_jumpc: evt.target.value,
  });
};

 
  // ==============================
  inserttimecloseValue = evt => {
    this.setState({
      timeclose: evt.target.value,
    });
  };


  edittimecloseValue = evt => {
    this.setState({
      buttonSimpanEdit:false,
      out_timeclose: evt.target.value,
    });
  };

  editLuasGudang = evt => {
    this.setState({
      buttonSimpanEdit:false,
      resultEyeout_luasgudang: evt.target.value,
    });
  };

  editAreaJualan = evt => {
    this.setState({
      buttonSimpanEdit:false,
      resultEyeout_luasareajualan: evt.target.value,
    });
  };

  // ==============================

  insertnpwpValue = evt => {
    this.setState({
      npwp: evt.target.value,
    });
  };

  editnpwpValue = evt => {
    console.log(evt.target.value)
    this.setState({
      buttonSimpanEdit: false,
      resultEyeout_npwp: evt.target.value,
    });
  };

  // ==============================

  insertnpwppphValue = evt => {
    console.log(evt.target.value)
    this.setState({
      npwppph: evt.target.value,
    });
  };
  editnpwppphValue = evt => {
    console.log(evt.target.value)
    this.setState({
      buttonSimpanEdit: false,
      resultEyeout_npwppph: evt.target.value,
    });
  };

  // ==============================

  insertscheduleDepositValue = evt => {
    console.log(evt.target.value)
    this.setState({
      scheduleDeposit: evt.target.value,
    });
  };

  editscheduleDepositValue = evt => {
    console.log(evt.target.value)
    this.setState({
      buttonSimpanEdit:false,
      out_jnsdeposit: evt.target.value,
    });
  };

  // ==============================

  insertscheduleroValue = evt => {
    //this.getClickedScheduleRO(evt.target.value)
    const resultJenisScheduleROContents = this.state
      .resultJenisScheduleROContents;
    this.setState(
      {
        resultEyeout_schedulerosenin:
          resultJenisScheduleROContents[evt.target.value].rec_monday,
        resultEyeout_jaminynSenin:
          resultJenisScheduleROContents[evt.target.value].rec_monday === 'Y',

        resultEyeout_scheduleroselasa:
          resultJenisScheduleROContents[evt.target.value].rec_tuesday,
        resultEyeout_jaminynSelasa:
          resultJenisScheduleROContents[evt.target.value].rec_tuesday === 'Y',

        resultEyeout_schedulerorabu:
          resultJenisScheduleROContents[evt.target.value].rec_wednesday,
        resultEyeout_jaminynRabu:
          resultJenisScheduleROContents[evt.target.value].rec_wednesday === 'Y',

        resultEyeout_schedulerokamis:
          resultJenisScheduleROContents[evt.target.value].rec_thursday,
        resultEyeout_jaminynKamis:
          resultJenisScheduleROContents[evt.target.value].rec_thursday === 'Y',

        resultEyeout_schedulerojumat:
          resultJenisScheduleROContents[evt.target.value].rec_friday,
        resultEyeout_jaminynJumat:
          resultJenisScheduleROContents[evt.target.value].rec_friday === 'Y',

        resultEyeout_schedulerosabtu:
          resultJenisScheduleROContents[evt.target.value].rec_saturday,
        resultEyeout_jaminynSabtu:
          resultJenisScheduleROContents[evt.target.value].rec_saturday === 'Y',

        schedulero: evt.target.value,
      },
      () =>
        console.log('wkwokwowkowo' + this.state.resultEyeout_schedulerosenin),
    );
  };

  editscheduleroValue = evt => {
    const resultJenisScheduleROContents = this.state
      .resultJenisScheduleROContents;
    this.setState({
      resultEyeout_schedulerosenin:
        resultJenisScheduleROContents[evt.target.value].rec_monday,
      resultEyeout_jaminynSenin:
        resultJenisScheduleROContents[evt.target.value].rec_monday === 'Y',

      resultEyeout_scheduleroselasa:
        resultJenisScheduleROContents[evt.target.value].rec_tuesday,
      resultEyeout_jaminynSelasa:
        resultJenisScheduleROContents[evt.target.value].rec_tuesday === 'Y',

      resultEyeout_schedulerorabu:
        resultJenisScheduleROContents[evt.target.value].rec_wednesday,
      resultEyeout_jaminynRabu:
        resultJenisScheduleROContents[evt.target.value].rec_wednesday === 'Y',

      resultEyeout_schedulerokamis:
        resultJenisScheduleROContents[evt.target.value].rec_thursday,
      resultEyeout_jaminynKamis:
        resultJenisScheduleROContents[evt.target.value].rec_thursday === 'Y',

      resultEyeout_schedulerojumat:
        resultJenisScheduleROContents[evt.target.value].rec_friday,
      resultEyeout_jaminynJumat:
        resultJenisScheduleROContents[evt.target.value].rec_friday === 'Y',

      resultEyeout_schedulerosabtu:
        resultJenisScheduleROContents[evt.target.value].rec_saturday,
      resultEyeout_jaminynSabtu:
        resultJenisScheduleROContents[evt.target.value].rec_saturday === 'Y',

      out_schedulero: evt.target.value,
    });
  };

  // ==============================

  insertclassValue = evt => {
    console.log(evt.target.value)
    this.setState({
      class: evt.target.value,
    });
  };
  editclassValue = evt => {
    console.log(evt.target.value)
    this.setState({
      out_class: evt.target.value,
      buttonSimpanEdit: false,
    });
  };

  // ==============================

  editJaminYN = event => {
    const checked = event.target.checked;
    var yn = this.state.resultEyeout_jaminyn;
    if (checked) {
      yn = 'Y';
      this.setState({
        resultEyeout_jaminyn: 'Y',
        inputEditJaminYN: false,
        buttonSimpanEdit:false,
      });
    } else {
      this.setState({
        resultEyeout_jaminyn: 'N',
        inputEditJaminYN: true,
        buttonSimpanEdit:true,
      });
    }
    console.log(
      'handleInputPajakCheckbox: ' + event.target.name + ' checked: ' + checked,
    );
    console.log(
      'handleInputPajakCheckbox: ' + event.target.name + ' YN: ' + yn,
    );
    this.setState({
      [event.target.name]: yn,
      [event.target.name + 'checked']: checked,
      [event.target.name + 'disabled']: !checked,
    });
  };


  insertRonaldo = event => {
    const checked = event.target.checked;
    var yn = this.state.out_robotgdyn;
  
    if (checked) {
      yn = 'Y';
    } else {
      yn = 'N';
    }
    console.log(
      'handleInputPajakCheckbox: ' + event.target.name + ' checked: ' + checked,
    );
    console.log(
      'handleInputPajakCheckbox: ' + event.target.name + ' YN: ' + yn,
    );
    this.setState({
      buttonSimpanEdit:false,
      [event.target.name]: yn,
      [event.target.name + 'Checked']: checked,
      [event.target.name + 'disabled']: !checked,
    });
  };

  editRonaldo = event => {
    const checked = event.target.checked;
    var yn = this.state.resultEyeout_robotgdyn;
  
    if (checked) {
      yn = 'Y';
    } else {
      yn = 'N';
    }
    console.log(
      'handleInputPajakCheckbox: ' + event.target.name + ' checked: ' + checked,
    );
    console.log(
      'handleInputPajakCheckbox: ' + event.target.name + ' YN: ' + yn,
    );
    this.setState({
      buttonSimpanEdit:false,
      [event.target.name]: yn,
      [event.target.name + 'Checked']: checked,
      [event.target.name + 'disabled']: !checked,
    });
  };


  
  editAllowCredit = event => {
    const checked = event.target.checked;
    var yn = this.state.out_allowcredityn;
  
    if (checked) {
      yn = 'Y';
    } else {
      yn = 'N';
    }
    console.log(
      'handleInputPajakCheckbox: ' + event.target.name + ' checked: ' + checked,
    );
    console.log(
      'handleInputPajakCheckbox: ' + event.target.name + ' YN: ' + yn,
    );
    this.setState({
      buttonSimpanEdit:false,
      [event.target.name]: yn,
      [event.target.name + 'Checked']: checked,
      [event.target.name + 'disabled']: !checked,
    });
  };



  editAllowPerjanjian = event => {
    const checked = event.target.checked;
    var yn = this.state.out_perjanjianyn;
    if (checked) {
      yn = 'Y';
    } else {
      yn = 'N';
    }
    console.log(
      'handleInputPajakCheckbox: ' + event.target.name + ' checked: ' + checked,
    );
    console.log(
      'handleInputPajakCheckbox: ' + event.target.name + ' YN: ' + yn,
    );
    this.setState({
      buttonSimpanEdit:false,
      [event.target.name]: yn,
      [event.target.name + 'Checked']: checked,
      [event.target.name + 'disabled']: !checked,
    });
  };



  editAllowCamera = event => {
    const checked = event.target.checked;
    var yn = this.state.out_camerayn;
    if (checked) {
      yn = 'Y';
    } else {
      yn = 'N';
    }
    console.log(
      'handleInputPajakCheckbox: ' + event.target.name + ' checked: ' + checked,
    );
    console.log(
      'handleInputPajakCheckbox: ' + event.target.name + ' YN: ' + yn,
    );
    this.setState({
      buttonSimpanEdit:false,
      [event.target.name]: yn,
      [event.target.name + 'Checked']: checked,
      [event.target.name + 'disabled']: !checked,
    });
  };

  
  // ==============================

  insertspecial_namaValue = evt => {
    console.log(evt.target.value)
    console.log(this.state.classspecial);
    this.setState({
      classspecial: evt.target.value,
    });
  };
  editspecial_namaValue = evt => {
    console.log(evt.target.value)
    console.log(this.state.out_classspecial);
    this.setState({
      buttonSimpanEdit: false,
      out_classspecial: evt.target.value,
    });
  };

  // ===============

  insertInputTelpValue = evt => {
    console.log(evt.target.value)
    this.setState({
      telout_number: evt.target.value,
      numberTelp: evt.target.value,
    });
  };


  // --------------------------------------------------------- UPDATE --------------------------------------------------------- EDITED BY RICHARD & DANIEL & KRISS

  //pada saat melakukan edit yang akan di lempar ke backend adalah first_param = nama yang telah di edit, second_param adalah yang didapatkan
  editOutlet = () => async () => {
    this.setState({ isLoading: true });
    var url = hostUrl+`/UbahDataOutlet/${this.state.resultEyeout_code}`;

    var payload = {
      out_jnssttk: this.state.out_jnssttk,
      out_name: this.state.out_names,
      out_timeclose: this.state.out_timeclose,
      out_email: this.state.out_email,
      out_jenisoutlet: this.state.out_jenisoutlet,
      out_address: this.state.out_address,
      out_fax: this.state.out_fax,
      out_jnsarea: this.state.out_jnsarea,
      out_jeniskepemilikan: this.state.out_jeniskepemilikan,
      out_citycode: this.state.out_citycode,
      out_postalcode: this.state.postalcode,
     
      out_square:this.state.resultEyeout_square,
      out_luasgudang:this.state.resultEyeout_luasgudang,
      out_luasareajualan:this.state.resultEyeout_luasareajualan,

      out_dateopen: this.state.dateopen,
      out_dateclose: this.state.dateclose,
   
      out_npwp: this.state.resultEyeout_npwp,
      out_npwppph: this.state.resultEyeout_npwppph,

      out_jnsdeposit: this.state.out_jnsdeposit,
      out_schedulero: this.state.out_schedulero,

      out_jaminyn: this.state.resultEyeout_jaminyn,
      out_jaminket: this.state.resultEyeout_jaminynKet,
      out_class: this.state.out_class,
      out_classspecial: this.state.out_classspecial,
      out_buyingpower:'0',
      out_jumpc: this.state.out_jumpc,
     

      out_allowcredityn:this.state.out_allowcredityn,
      out_perjanjianyn:this.state.out_perjanjianyn,
      out_camerayn:this.state.out_camerayn,

      out_userid : "0",
      out_robotgdyn : this.state.resultEyeout_robotgdyn

    };
    console.log(payload);
    let data = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      json: true,
      body: JSON.stringify(payload),
    })
      //2.Ketika sudah terespond oleh backend , maka kita akan melakukan hal ini
      .then(response => {
        if (response.ok) {
          this.isLoading = false;
          //state ini diawal dibuat false

          this.state.backdrop = false;
          this.componentDidMount();
          return response.json();
        }
      });
    if (data) {
      this.showNotification(
        'Data Berhasil di Ubah Menjadi ' + this.state.resultEyeout_code + '',
      );
      this.state.modal_update = false;
      this.state.modal_nested = false;
    } else {
      alert('Data yang Diubah sama !');
    }
  };

  editTelpon = async () => {
    this.setState({ isLoading: true });
    var url = hostUrl+`/UbahTeleponOutlet/${this.state.telout_runningid}`;
    console.log(url);
    var payload = {
      telout_outcode: this.state.telout_outcode,
      telout_areacode: this.state.telout_areacode,
      telout_number: this.state.telout_number,
      telout_userid: '0',
    };
    console.log(payload);
    let data = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      json: true,
      body: JSON.stringify(payload),
    })
      //2.Ketika sudah terespond oleh backend , maka kita akan melakukan hal ini
      .then(response => {
        if (response.ok) {
          this.isLoading = false;
          this.setState({
            modal_update_telp: false,
          });

          this.componentDidMount();
          return response.json();
        }
      });
    if (data) {
      this.getListNomorTelp(this.state.telout_outcode);
      this.showNotification(
        'Data Berhasil di Ubah Menjadi ' + this.state.telout_number + '',
      );
      this.isLoading = true;
    } else {
      alert('Data yang Diubah sama !');
    }
  };

  boolean = false;

  //ketika melakukan update, input an yang masuk harus uppercase dan tidak boleh special character
  updateInputValue = evt => {
    this.setState({
      buttonSimpanEdit: true,
      inputtedName: evt.target.value.replace(/[^\w\s]/gi, '').toUpperCase(),
    });
  };
  // set awal pada saat membuka update

  //(first_param,second_param,third_param)
  updateModalWithItemID(
    telout_outcode,
    telout_areacode,
    telout_number,
    telout_runningid,
  ) {
    this.setState({
      telout_outcode: telout_outcode,
      telout_areacode: telout_areacode,
      telout_number: telout_number,
      telout_runningid: telout_runningid,
      modal_update_telp: true,
    });
  }

  updateModalTelp(idUpdateEkspedisi, namaUpdateEkspedisi, kodeUpdateEkspedisi) {
    this.setState({
      modal_update: true,
      activeItem_Id2: idUpdateEkspedisi,
      inputtedName: namaUpdateEkspedisi,
      inputtedKode: kodeUpdateEkspedisi,
    });
  }

  viewModalTelp(jnsarea, square, outcode, kodetelp) {
    this.getListNomorTelp(outcode);

    this.setState({
      modal_inputtelp: true,
      jnsarea: jnsarea,
      square: square,
      telout_outcode: outcode,
      resultKodeTelp: kodetelp,
    });
  }

  //(first_param,second_param,third_param)
  viewModalWithItemID(
    outcode,
    jnsarea,
    square,
    luasgudang,
    luasareajualan,
    dateopen,
    dateclose,
    jenisoutlet,
    jeniskepemilikan,
    timeclose,
    picdaNIP,
    picdaName,
    npwp,
    jnsdeposit,
    schedulero,
    jaminyn,
 
    classes,
    classSpecial,
  ) {
    // =====================================
    var jaminynCheckedValue = false;
    console.log(jaminyn);
    if (jaminyn === 'Y') {
      jaminynCheckedValue = true;
      console.log(jaminynCheckedValue);
    }
    this.setState({
      modal_view: true,
      outcode: outcode,
      jnsarea: jnsarea,
      square: square,
      luasgudang: luasgudang,
      luasareajualan: luasareajualan,
      dateopen: dateopen,
      dateclose: dateclose,
      jenisoutlet: jenisoutlet,
      jeniskepemilikan: jeniskepemilikan,
      timeclose: timeclose,
      picdaNIP: picdaNIP,
      picdaName: picdaName,
      npwp: npwp,
      jnsdeposit: jnsdeposit,
      schedulero: schedulero,
      jaminyn: jaminynCheckedValue,

      classes: classes,
      classSpecial: classSpecial,
    });
  }

  // --------------------------------------------------------- SEARCH --------------------------------------------------------- EDITED BY RICHARD & DANIEL & KRISS

  //mengambil parameter yang telah diinput di searchInputtedName . lalu dilempar ke Backend
  searchInputValue = () => {
    //mengambil data dari backend

    //apabila kosong dia tidak akan mencari
    if (this.state.searchInputtedName.length !== 0) {
      this.setState({ isLoading: true });
      var url = hostUrl+`/CariDataOutlet/${this.state.searchInputtedName}`;
      fetch(url)
        .then(response => response.json())
        .then(data =>
          this.setState({ result: data.content, isLoading: false }),
        );
      //pada saat melakukan search, pagination yang dibawah di matikan sehingga tidak ada pagination
      //d-none itu display none cari di documentation bootstra

      this.state.hidePagination = 'd-none';
    } else {
      //apabila tidak melakukan search, pagination nya tidak dihilangkan
      //flex-row itu class name
      this.componentDidMount();
      this.isLoading = false;
      this.state.hidePagination = 'flex-row';
    }
  };

  //function untuk melakukan search pada saat menekan enter
  enterPressed = (event, search) => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      //13 is the enter keycode
      //Do stuff in here
      event.preventDefault();
      if (search === true) {
        this.setState(() => {
          this.searchInputValue(this.state.searchInputtedName);
        });
      } else {
        this.componentDidMount();
      }
    }
  };

  //ketika melakukan search, state input-an yang masuk harus uppercase dan tidak boleh special character
  setSearchInputState = evt => {
    this.setState({
      searchInputtedName: evt.target.value
        .replace(/[^\w\s]/gi, '')
        .toUpperCase(),
    });
  };

  //--------------------------------------------------------- DELETE --------------------------------------------------------- EDITED BY RICHARD & DANIEL & KRISS

  // 1.Pelemparan parameter ke Backend dimana data apa saja yang akan di hapus
  deleteOutlet = param => async () => {
    var url = hostUrl+`/HapusDataOutlet/${param}`;
    var payload = {
      out_userid: '0',
    };
    let data = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    })
      //2.Ketika sudah terespond oleh backend , maka frontend akan melakukan hal ini
      .then(response => {
        if (response.ok) {
          this.state.modal_delete = false;
          this.state.modal_nested = false;
          this.state.backdrop = false;
          this.componentDidMount();
          return response.json();
        }
      });

    if (data) {
      this.showNotification('Data Berhasil di Hapus');
    }
  };

  deleteTelpon = () => async () => {
    this.isLoading = true;
    var url = hostUrl+`/HapusTeleponOutlet/${this.state.telout_runningid}`;
    console.log(this.state.telout_runningid + url);
    var payload = {
      telout_userid: '0',
    };
    let data = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    })
      //2.Ketika sudah terespond oleh backend , maka frontend akan melakukan hal ini
      .then(response => {
        if (response.ok) {
          this.state.modal_delete_telp = false;
          this.isLoading = false;
          return response.json();
        }
      });

    if (data) {
      this.getListNomorTelp(this.state.telout_outcode);
      this.showNotification('Data Telpon Berhasil di Hapus');
    }
  };

  // set awal pada saat membuka delete
  openModalWithItemID(out_code, out_name) {
    this.setState({
      modal_delete: true,
      out_code: out_code,
      out_name: out_name,
    });
  }

  openModalTelpDelete(telout_runningid) {
    this.setState({
      telout_runningid: telout_runningid,
      modal_delete_telp: true,
    });
  }

  //render biasa nya di-isi untuk desain HTML
  render() {
    //date
    var currOpen = new Date();
    var currClose = new Date();
    currOpen.setDate(currOpen.getDate() + 14);
    currClose.setDate(currClose.getDate());
    var dateOpen = currOpen.toISOString().substr(0, 10);
    var dateClose = currClose.toISOString().substr(0, 10);
    //loading
    const { result, isLoading, resultTelp } = this.state;

    return (
      <Page
        title="Outlet"
        breadcrumbs={[{ name: 'outlet', active: true }]}
        className="OutletPage"
      >
        <Card className="mb-3">
          <NotificationSystem
            dismissible={false}
            ref={notificationSystem =>
              (this.notificationSystem = notificationSystem)
            }
            style={NOTIFICATION_SYSTEM_STYLE}
          />
          {/* ======================================INPUT SEARCH============================== */}
          <CardHeader className="d-flex justify-content-between">
            <Card>
              <Form inline className="cr-search-form">
                <MdSearch
                  size="20"
                  className="cr-search-form__icon-search text-secondary"
                />

                <Card className="d-flex">
                  <Input
                    disabled={isLoading}
                    value={this.state.searchInputtedName}
                    onChange={evt => this.setSearchInputState(evt)}
                    onKeyPress={event => this.enterPressed(event, true)}
                    className="cr-search-form__input"
                    placeholder="Cari.."
                  />
                  {!isLoading && <i className="fa fa-refresh fa-spin"></i>}
                </Card>
                {/* ======================================CLICK SEARCH============================== */}
                <Card className="d-flex">
                  <Button
                    onSubmit={e => e.preventDefault()}
                    value={this.state.searchInputtedName}
                    onClick={evt => this.searchInputValue(evt)}
                  >
                    <MdSearch></MdSearch>
                  </Button>
                </Card>
              </Form>
            </Card>
            {/* ======================================KETIKA TAMBAH DATA============================== */}
            <Button onClick={() => this.clickTambah()}>Tambah</Button>
            <Modal
              isOpen={this.state.modal_nested_parent}
              toggle={this.toggle('nested_parent')}
              className={this.props.className}
              onExit={this.handleClose}
              size="lg"
            >
              <ModalHeader toggle={this.toggle('nested_parent')}>
                Tambah Outlet
              </ModalHeader>
              <ModalBody>
                <Form>
                  <Row className="show-grid">
                    <Col xs={8} md={4}>
                      <Label>Nama Outlet</Label>
                    </Col>
                    <Col xs={2} md={4}>
                      <Input
                        id="namaOutlet"
                        required="required"
                        onChange={evt => this.insertnameValue(evt)}
                        type="namaOutlet"
                        value={this.state.name}
                      />
                    </Col>
                  </Row>
                  <Row className="show-grid  mt-3">
                    <Col xs={8} md={6}>
                      <Label>Alamat</Label>
                    </Col>
                    <Col xs={8} md={4}>
                      <Label>Kota</Label>
                    </Col>
                    <Col xs={8} md={2}>
                      <Label>Kode Pos</Label>
                    </Col>
                  </Row>

                  <Row className="show-grid">
                    <Col xs={8} md={6}>
                      <Input
                        id="alamatOutlet"
                        onChange={evt => this.insertaddressValue(evt)}
                        type="textarea"
                        value={this.state.address}
                        disabled={this.state.disabledAlamatOutlet}
                      />
                    </Col>

                    <Col xs={8} md={4}>
                      <Input
                        onChange={evt => this.insertcitycodeValue(evt)}
                        type="select"
                        maxLength="3"
                        id="kotaOutlet"
                        value={this.state.citycode}
                        disabled={this.state.disabledcitycode}
                      >
                        {this.state.Kotas.map(kota => (
                          <option key={kota.value} value={kota.value}>
                            {kota.display}
                          </option>
                        ))}
                      </Input>
                    </Col>

                    <Col xs={8} md={2}>
                      <Input
                        onChange={evt => this.insertpostalcodeValue(evt)}
                        id="zipOutlet"
                        type="namaekspedisi"
                        maxLength="5"
                        disabled={this.state.disabledpostalcode}
                        value={this.state.postalcode}
                      />
                    </Col>
                  </Row>

                  <Row className='d-flex justify-content-center'>
                    <Col xs={4} md={4}>
                      <Label>Email</Label>
                    </Col>
                    <Col xs={4} md={4}>
                    <Label>Fax</Label>
                  </Col>
                  </Row>
                  <Row className='d-flex justify-content-center'>
                  <Col xs={4} md={4}>
                      <Input
                      placeholder= "Email"
                        id="emailOutlet"
                        onChange={evt => this.onChangeEmail(evt)}
                        type="text"
                        value={this.state.out_email}
                      />
                    </Col>
                    <Col xs={4} md={4}>
                      <Input
                      placeholder= "Fax"
                        id="faxOutlet"
                        onChange={evt => this.onChangeFax(evt)}
                        type="text"
                        value={this.state.out_fax}
                      />
                    </Col>
                  </Row>

                  <Row className="show-grid mt-3">
                    <Col xs={8} md={4}>
                      <Label>Jenis Area</Label>
                    </Col>
                    <Col xs={2} md={4}>
                      <Input
                        id="jenisArea"
                        onChange={evt => this.insertjnsareaValue(evt)}
                        type="select"
                        value={this.state.jnsarea}
                      >
                        {this.state.JenisAreas.map(JenisArea => (
                          <option key={JenisArea.value} value={JenisArea.value}>
                            {JenisArea.display}
                          </option>
                        ))}
                      </Input>
                    </Col>
                  </Row>

                  <Row className="show-grid mt-3">
                    <Col xs={6} md={4}>
                      <Label>Luas Total</Label>
                    </Col>
                    <Col xs={6} md={4}>
                      <Label>Gudang</Label>
                    </Col>
                    <Col xs={6} md={2}>
                      <Label>Area Jualan</Label>
                    </Col>
                  </Row>

                  <Row className="show-grid ">
                    <Col xs={6} md={4}>
                      <InputGroup>
                        <Input
                          id="luasArea"
                          onChange={evt => this.insertsquareValue(evt)}
                          inputmode="numeric"
                          type="number"
                          step="any"
                          min="0"
                          max="100"
                          value={this.state.square}
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">m2</span>
                        </div>
                      </InputGroup>
                    </Col>
                    <Col xs={6} md={4}>
                      <InputGroup>
                        <Input
                          id="luasGudang"
                          onChange={evt => this.insertluasgudangValue(evt)}
                          type="number"
                          step="any"
                          min="0"
                          max="100"
                          value={this.state.luasgudang}
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">m2</span>
                        </div>
                      </InputGroup>
                    </Col>
                    <Col xs={6} md={4}>
                      <InputGroup>
                        <Input
                          id="luasJualan"
                          onChange={evt => this.insertluasareajualanValue(evt)}
                          type="number"
                          step="any"
                          min="0"
                          max="100"
                          value={this.state.luasareajualan}
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">m2</span>
                        </div>
                      </InputGroup>
                    </Col>
                  </Row>

                  <Row className="show-grid  mt-3">
                    <Col xs={8} md={4}>
                      <Label>Tanggal Buka</Label>
                    </Col>
                    <Col xs={2} md={4}>
                      <FormGroup>
                        <Input
                          type="date"
                          onChange={evt =>
                            this.handleSik2StartDateInputChange(evt)
                          }
                          id="tanggalBuka"
                          name="tanggalBuka"
                          required
                          class="datepicker-input"
                          value={this.state.dateopen}
                          disabled={this.state.disabledEfektifMesin}
                          invalid={this.state.hostout_tglefektifmesinInvalid}
                          valid={this.state.hostout_tglefektifmesinValid}
                        ></Input>
                      </FormGroup>
                    </Col>

                    <Col xs={2} md={2}>
                      <MdWarning
                        className={this.state.mdWarning + ' mt-2'}
                        color="#fee12b"
                        id="UncontrolledTooltipExample"
                        size="25px"
                      ></MdWarning>

                      <UncontrolledTooltip
                        placement="right"
                        target="UncontrolledTooltipExample"
                      >
                        Tanggal Buka tidak boleh kurang dari 14 hari
                      </UncontrolledTooltip>
                    </Col>
                  </Row>

                  <Row className="show-grid  mt-3">
                    <Col xs={8} md={4}>
                      <Label>Tanggal Tutup</Label>
                    </Col>
                    <Col xs={2} md={4}>
                      <Input
                        onChange={evt => this.handleSik2EndDateInputChange(evt)}
                        type="date"
                        id="tanggalTutup"
                        name="tanggalTutup"
                        defaultValue={dateClose}
                        value={this.state.dateclose}
                        disabled={this.state.disabledtanggalTutup}
                        invalid={this.state.hostout_penarikanmesinInvalid}
                        valid={this.state.hostout_penarikanmesinValid}
                      ></Input>
                    </Col>
                  </Row>

                  <Row className="show-grid  mt-3">
                    <Col xs={8} md={4}>
                      <Label>Jenis Outlet</Label>
                    </Col>
                    <Col xs={2} md={4}>
                      <Input
                        id="jenisOutlet"
                        onChange={evt => this.insertjenisoutletValue(evt)}
                        type="select"
                        value={this.state.jenisoutlet}
                      >
                        {this.state.outlets.map(outlet => (
                          <option key={outlet.value} value={outlet.value}>
                            {outlet.display}
                          </option>
                        ))}
                      </Input>
                    </Col>
                  </Row>

                  <Row className="show-grid  mt-3">
                    <Col xs={8} md={4}>
                      <Label>Dijaminkan</Label>
                    </Col>
                    <Col xs={4} md={4}>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <Input
                            
                              id="jaminYNChecbox"
                              addon
                              value={this.state.out_jaminyn}
                              type="checkbox"
                              onChange={evt => this.onCheckJaminYN(evt)}
                            />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          onChange={evt => this.onChangeJaminKet(evt)}
                          maxLength="25"
                          placeholder="Bank"
                          value={this.state.jaminket}
                          disabled = {this.state.jaminketDisabled}
                          id="jaminYNInput"
                        />
                      </InputGroup>
                    </Col>
                  </Row>
               
<Row className='d-flex justify-content-center mt-2'>

<Col xs={5} md={5}>
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <Input
                                value={
                                  this.state.out_allowcredityn
                                }
                                name="out_allowcredityn"
                                onClick={event => this.editAllowCredit(event)}
                                  checked={this.state.out_allowcreditynChecked}
                                  id="creditYNChecbox"
                                  addon
                                  type="checkbox"
                                
                                />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input disabled placeholder="Allow Credit"></Input>
                          </InputGroup>
                          </Col>
                        
<Col xs={5} md={5}>
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <Input
                                name="out_perjanjianyn"
                                  value={
                                    this.state.out_perjanjianyn
                                  } onClick={event => this.editAllowPerjanjian(event)}
                                
                                  checked={this.state.out_perjanjianynChecked}
                                  id="perjanjianYNChecbox"
                                  addon
                                  type="checkbox"
                
                                />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input disabled placeholder="Ada Perjanjian"></Input>
                          </InputGroup>
                        </Col>
 
</Row>

                </Form>
              </ModalBody>
              <ModalFooter>
                <Button
                  id="buttonSimpan"
                  color="primary"
                  onClick={() => this.validationSubmit()}
                  disabled={this.state.disabledButtonNext}
                >
                  Next
                </Button>
                <Modal
                  size="lg"
                  isOpen={this.state.modal_nested}
                  toggle={this.toggle('nested')}
                  onExit={this.handleClose}
                >
                  <ModalBody>
                    <ModalHeader toggle={this.toggle('nested')}>
                      Tambah Outlet
                    </ModalHeader>
                    <ModalBody size="lg">
                      <Row className="show-grid">
                        <Col xs={8} md={4}>
                          <Label>Jenis Stocktake</Label>
                        </Col>

                        <Col xs={2} md={4}>
                          <Input
                            id="jenisStocktake"
                            onChange={evt =>
                              this.insertjenisStocktakeValue(evt)
                            }
                            maxLength="2"
                            type="select"
                            value={this.state.jenisstocktake}
                          >
                            {this.state.JenisStockTakes.map(JenisStockTake => (
                              <option
                                key={JenisStockTake.value}
                                value={JenisStockTake.value}
                              >
                                {JenisStockTake.display}
                              </option>
                            ))}
                          </Input>
                        </Col>
                      </Row>
                      <Row className="show-grid mt-3">
                        <Col xs={8} md={4}>
                          <Label>Kepemilikan</Label>
                        </Col>

                        <Col xs={2} md={4}>
                          <Input
                            onChange={evt =>
                              this.insertjeniskepemilikanValue(evt)
                            }
                            id="kepemilikanOutlet"
                            type="select"
                            value={this.state.out_jeniskepemilikan}
                          >
                            {this.state.JenisKepemilikans.map(
                              JenisKepemilikan => (
                                <option
                                  key={JenisKepemilikan.value}
                                  value={JenisKepemilikan.value}
                                >
                                  {JenisKepemilikan.display}
                                </option>
                              ),
                            )}
                          </Input>
                        </Col>
                      </Row>

                      <Row className="show-grid mt-3 ">
                        <Col xs={8} md={4}>
                          <Label>Jam Tutup</Label>
                        </Col>
                        <Col xs={2} md={4}>
                          <FormGroup>
                            <Input
                              type="time"
                              required
                              id="jamTutup"
                              name="time"
                              placeholder="time placeholder"
                              onChange={evt => this.inserttimecloseValue(evt)}
                              value={this.state.timeclose}
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row className="show-grid ">
                        <Col xs={8} md={4}>
                          <Label>NPWP</Label>
                        </Col>
                        <Col>
                          <Label>PPN</Label>

                          <Input
                            id="npwpPPN"
                            mask="99.999.999.9-999-999"
                            onChange={evt => this.insertnpwpValue(evt)}
                            value={this.state.npwp}
                            tag={InputMask}
                          ></Input>
                        </Col>

                        <Col>
                          <Label>PPH21</Label>
                          <Input
                            id="npwpPPH21"
                            onChange={evt => this.insertnpwppphValue(evt)}
                            mask="99.999.999.9-999-999"
                            value={this.state.npwppph}
                            tag={InputMask}
                          ></Input>
                        </Col>
                      </Row>
                      <Row className="show-grid  mt-3">
                        <Col xs={8} md={4}>
                          <Label>Schedule Input Deposit Batch</Label>
                        </Col>
                        <Col xs={2} md={4}>
                          <FormGroup>
                            <Input
                              type="select"
                              name="select"
                              id="scheduleDeposit"
                              onChange={evt =>
                                this.insertscheduleDepositValue(evt)
                              }
                              value={this.state.scheduleDeposit}
                            >
                              {this.state.JenisDepositBatchs.map(
                                JenisDepositBatch => (
                                  <option
                                    key={JenisDepositBatch.value}
                                    value={JenisDepositBatch.value}
                                  >
                                    {JenisDepositBatch.display}
                                  </option>
                                ),
                              )}
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row className="show-grid mt-3">
                        <Col xs={8} md={4}>
                          <Label>Schedule RO</Label>
                        </Col>

                        <Col xs={4} md={4}>
                          <Input
                            id="scheduleRO"
                            onChange={evt => this.insertscheduleroValue(evt)}
                            type="select"
                            value={this.state.schedulero}
                          >
                            {this.state.JenisScheduleROs.map(schedule => (
                              <option
                                key={schedule.value}
                                value={schedule.value}
                              >
                                {schedule.display}
                              </option>
                            ))}
                          </Input>
                        </Col>
                      </Row>
                      <Row className="mt-3 ">
                        <Col xs={3} md={3}>
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <Input
                                  disabled
                                  value={
                                    this.state.resultEyeout_schedulerosenin
                                  }
                                  checked={this.state.resultEyeout_jaminynSenin}
                                  id="jaminYNChecbox"
                                  addon
                                  type="checkbox"
                                />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input disabled placeholder="Senin"></Input>
                          </InputGroup>
                        </Col>

                        <Col xs={3} md={3}>
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <Input
                                disabled
                                  value={
                                    this.state.resultEyeout_scheduleroselasa
                                  }
                                  checked={
                                    this.state.resultEyeout_jaminynSelasa
                                  }
                                  id="jaminYNChecbox"
                                  addon
                                  type="checkbox"
                                />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input disabled placeholder="Selasa"></Input>
                          </InputGroup>
                        </Col>

                        <Col xs={3} md={3}>
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <Input
                                disabled
                                  value={this.state.resultEyeout_schedulerorabu}
                                  checked={this.state.resultEyeout_jaminynRabu}
                                  id="jaminYNChecbox"
                                  addon
                                  type="checkbox"
                                />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input disabled placeholder="Rabu"></Input>
                          </InputGroup>
                        </Col>

                        <Col xs={3} md={3}>
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <Input
                                  disabled
                                  value={
                                    this.state.resultEyeout_schedulerokamis
                                  }
                                  checked={this.state.resultEyeout_jaminynKamis}
                                  id="jaminYNChecbox"
                                  addon
                                  type="checkbox"
                                />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input disabled placeholder="Kamis"></Input>
                          </InputGroup>
                        </Col>
                        <Col xs={3} md={3}></Col>

                        <Col xs={3} md={3}>
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <Input
                                  disabled
                                  value={
                                    this.state.resultEyeout_schedulerojumat
                                  }
                                  checked={this.state.resultEyeout_jaminynJumat}
                                  id="jaminYNChecbox"
                                  addon
                                  type="checkbox"
                                />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input disabled placeholder="Jumat"></Input>
                          </InputGroup>
                        </Col>

                        <Col xs={3} md={3}>
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <Input
                                  disabled
                                  value={
                                    this.state.resultEyeout_schedulerosabtu
                                  }
                                  checked={this.state.resultEyeout_jaminynSabtu}
                                  id="jaminYNChecbox"
                                  addon
                                  type="checkbox"
                                />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input disabled placeholder="Sabtu"></Input>
                          </InputGroup>
                        </Col>
                      </Row>

                      <Row className="show-grid ">
                        <Col xs={8} md={4}>
                          <Label>Class</Label>
                        </Col>
                        <Col xs={8} md={4}>
                          <Label>Class Special</Label>
                        </Col>
                        <Col xs={4} md={4}></Col>
                      </Row>
                      <Row className="show-grid ">
                        <Col xs={4} md={4}>
                          <Input
                            id="class"
                            type="select"
                            onChange={evt => this.insertclassValue(evt)}
                            value={this.state.class}
                          >
                            <option style={{ display: 'none' }}>
                              Pilih Class
                            </option>
                            <option>A</option>
                            <option>B</option>
                            <option>C</option>
                          </Input>
                        </Col>

                        <Col xs={4} md={4}>
                          <Input
                            id="classSpecial"
                            type="select"
                            onChange={evt => this.insertspecial_namaValue(evt)}
                            value={this.state.classspecial}
                          >
                            {this.state.JenisClassSpecials.map(
                              JenisClassSpecial => (
                                <option
                                  key={JenisClassSpecial.value}
                                  value={JenisClassSpecial.value}
                                >
                                  {JenisClassSpecial.display}
                                </option>
                              ),
                            )}
                          </Input>
                        </Col>

                        <Col xs={3} md={3}>
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <Input

                                name="resultEyeout_robotgdyn"
                                id="ronaldoYN"
                                type="checkbox"
                                addon
                                checked={this.state.resultEyeout_robotgdynChecked}
                                onClick={event => this.insertRonaldo(event)}
                                  value={this.state.out_robotgdyn}
                                ></Input>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input disabled placeholder="Ronaldo"></Input>
                          </InputGroup>
                        </Col>
                      </Row>

                      <Row className="show-grid  ">
                        <Col xs={8} md={4}>
                          <Label>Jumlah PC</Label>
                        </Col>
                       
                        
                      </Row>

                      <Row className="show-grid  ">

                      <Col className="mt-1" xs={3} md={3}>
                      <Input
                      id="jumlahPC"
                      type="number"
                      max="3"
                      onChange={evt => this.insertJumlahPC(evt) }
                      value={this.state.out_jumpc}
                      >
                      
                      </Input>
                      </Col>

                   

                      </Row>
                    </ModalBody>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="primary"
                      onClick={() => this.validationSubmit2()}
                      disabled={isLoading}
                    >
                      Simpan
                    </Button>{' '}
                  </ModalFooter>
                </Modal>{' '}
                <Button color="primary" onClick={this.toggle('nested_parent')}>
                  Batal
                </Button>
              </ModalFooter>
            </Modal>
            <Modal
              isOpen={this.state.modal_submitTambah}
              toggle={this.toggle('submitTambah')}
            >
              <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
              <ModalBody>Apakah Anda yakin ingin menambah data ini?</ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={this.addOutlet()}>
                  {!isLoading && <i className="fa fa-refresh fa-spin"></i>}
                  Ya
                </Button>{' '}
                <Button color="primary" onClick={this.toggle('submitTambah')}>
                  Tidak
                </Button>
              </ModalFooter>
            </Modal>{' '}
            {/* ======================================KETIKA DELETE DATA(NON-AKTIF DATA YANG AKTIF)============================== */}
            <Modal
              isOpen={this.state.modal_delete}
              toggle={this.toggle('delete')}
              className={this.props.className}
            >
              <ModalHeader toggle={this.toggle('delete')}>
                Konfirmasi Penonaktifan
              </ModalHeader>
              <ModalBody>
                Apakah Anda yakin ingin menonaktifkan data ini?
              </ModalBody>

              <ModalFooter>
                <Button
                  color="primary"
                  onClick={this.deleteOutlet(this.state.out_code)}
                >
                  {!isLoading && <i className="fa fa-refresh fa-spin"></i>}
                  Ya
                </Button>
                {''}

                <Button color="primary" onClick={this.toggle('delete')}>
                  Tidak
                </Button>
              </ModalFooter>
            </Modal>
            <Modal
              isOpen={this.state.modal_delete_telp}
              toggle={this.toggle('deleteTelp')}
              className={this.props.modal_delete_telp}
            >
              <ModalHeader toggle={this.toggle('delete')}>
                Konfirmasi Penonaktifan
              </ModalHeader>
              <ModalBody>
                Apakah Anda yakin ingin menonaktifkan data telpon ini?
              </ModalBody>

              <ModalFooter>
                <Button
                  color="primary"
                  onClick={this.deleteTelpon(this.state.telout_runningid)}
                >
                  {!isLoading && <i className="fa fa-refresh fa-spin"></i>}
                  Ya
                </Button>
                {''}

                <Button color="primary" onClick={this.toggle('deleteTelp')}>
                  Tidak
                </Button>
              </ModalFooter>
            </Modal>
            {/* ======================================KETIKA EDIT/UPDATE DATA============================== */}
            <Modal
              size="lg"
              isOpen={this.state.modal_update}
              toggle={this.toggle('update')}
              className={this.props.className + ' modal-dialog-scrollable'}
              onExit={this.handleClose}
              onClosed={this.handleClose}
            >
              <ModalHeader toggle={this.toggle('update')}>
                Edit Outlet
              </ModalHeader>

              <ModalBody>
                <Card outline color="primary">
                  <CardBody>
                    <Row className="show-grid ">
                      <Col xs={8} md={4}>
                        <Label>Outlet ID</Label>
                      </Col>
                      <Col xs={2} md={4}>
                        <Label>Jenis Area</Label>
                      </Col>
                      <Col xs={2} md={4}>
                        <Label>Jenis Outlet</Label>
                      </Col>
                    </Row>
                    <Row className="show-grid ">
                      <Col xs={8} md={4}>
                        <Input
                          type="namaekspedisi"
                          disabled
                          value={this.state.resultEyeout_code}
                        />
                      </Col>

                      <Col xs={2} md={4}>
                        <Input
       
                          onChange={evt => this.editjnsareaValue(evt)}
                          type="select"
                          value={this.state.out_jnsarea}
            
                        >
                          {this.state.JenisAreas.map(JenisArea => (
                            <option
                              key={JenisArea.value}
                              value={JenisArea.value}
                            >
                              {JenisArea.display}
                            </option>
                          ))}
                        </Input>
                      </Col>

                      <Col xs={2} md={4}>
                        <Input
                          onChange={evt => this.editjenisoutletValue(evt)}
                          type="select"
                          value={this.state.out_jenisoutlet}
                      
                        >
                          {this.state.outlets.map(outlet => (
                            <option key={outlet.value} value={outlet.value}>
                              {outlet.display}
                            </option>
                          ))}
                        </Input>
                      </Col>
                    </Row>

                    <Row className="show-grid mt-1 ">
                      <Col xs={4} md={4}>
                        <Label>Outlet Name</Label>
                      </Col>
                      <Col xs={4} md={8}>
                        <Input
                          disabled
                          onChange={evt => this.editOutletName(evt)}
                          type="text"
                          value={this.state.out_names}
                        ></Input>
                      </Col>
                    </Row>

<Row className='d-flex justify-content-center mt-2'>

<Col xs={5} md={5}>
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <Input
                               
                                  value={
                                    this.state.out_allowcredityn
                                  }
                                  name="out_allowcredityn"
                                  onClick={event => this.editAllowCredit(event)}
                                  checked={this.state.out_allowcreditynChecked}
                                  addon
                                  type="checkbox"
                                />

                              </InputGroupText>
                            </InputGroupAddon>
                            <Input disabled placeholder="Allow Credit"></Input>
                          </InputGroup>
                          </Col>
                        
<Col xs={5} md={5}>
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <Input
                                name="out_perjanjianyn"
                                  value={
                                    this.state.out_perjanjianyn
                                  }
                                  onClick={event => this.editAllowPerjanjian(event)}
                                  checked={this.state.out_perjanjianynChecked}
                                  id="perjanjianYNChecbox"
                                  addon
                                  type="checkbox"
                                />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input disabled placeholder="Ada Perjanjian"></Input>
                          </InputGroup>
                        </Col>

</Row>





                  </CardBody>
                </Card>

                <Row className="show-grid">
                  <Col xs={5} md={5}>
                    <Label>Alamat</Label>
                  </Col>
                  <Col xs={3} md={4}>
                    <Label>Kota</Label>
                  </Col>
                  <Col xs={3} md={3}>
                    <Label>Kode Pos</Label>
                  </Col>
                </Row>
                <Row className="show-grid">
                  <Col xs={8} md={5}>
                    <Input
                   
                      onChange={evt => this.editaddressValue(evt)}
                      type="textarea"
                      value={this.state.out_address}
                    />
                  </Col>

                  <Col xs={4} md={4}>
                    <Input
                 
                      onChange={evt => this.editcitycodeValue(evt)}
                      type="select"
                      maxLength="3"
                      value={this.state.out_citycode}
                    >
                      {this.state.Kotas.map(kota => (
                        <option key={kota.value} value={kota.value}>
                          {kota.display}
                        </option>
                      ))}
                    </Input>
                  </Col>

                  <Col xs={3} md={3}>
                    <Input
                   
                      onChange={evt => this.editpostalcodeValue(evt)}
                      type="namaekspedisi"
                      maxLength="5"
                      placeholder="Postal Code"
                      value={this.state.postalcode}
                    />
                  </Col>
                </Row>


                
                <Row className="show-grid mt-2">
                <Col xs={4} md={4}>
                  <Label>Email</Label>
                 
                </Col>
                <Col xs={8} md={8}>
                <Input
                placeholder = "Email"
          
                type="Email"
                onChange={evt => this.onChangeEmail(evt)}
                value={this.state.out_email}
              />
              </Col>
               

              </Row>
                <Row className="show-grid mt-2">
                <Col xs={4} md={4}>
                  <Label>Jenis Stocktake</Label>
                </Col>

                <Col xs={4} md={4}>
                <Label>Fax</Label>
              </Col>

              </Row>
              
                <Row className="show-grid mt-2">
                  
                  <Col xs={4} md={4}>
                    <Input
                     
                      onChange={evt => this.editjenisStocktakeValue(evt)}
                      maxLength="2"
                      type="select"
                      value={this.state.out_jnssttk}
                    >
                      {this.state.JenisStockTakes.map(JenisStockTake => (
                        <option
                          key={JenisStockTake.value}
                          value={JenisStockTake.value}
                        >
                          {JenisStockTake.display}
                        </option>
                      ))}
                    </Input>
                  </Col>


                  <Col xs={4} md={4}>
                  <Input
                    placeholder = "Fax"
                    onChange={evt => this.onChangeFax(evt)}
                    type="fax"
                    value={this.state.out_fax}
                  />
                </Col>
                </Row>

                <Row className="show-grid  mt-3">
                  <Col xs={8} md={2}>
                    <Label>Luas Total</Label>
                  </Col>
                  <Col xs={8} md={2}>
                    <Input
                      disabled
                   
                      type="number"
                      value={this.state.resultEyeout_square}
                    />
                  </Col>
                  <Col xs={8} md={2}>
                    <Label>Gudang</Label>
                  </Col>
                  <Col xs={8} md={2}>
                    <Input
                      onChange={evt=> this.editLuasGudang(evt)}
                      type="number"
                      value={this.state.resultEyeout_luasgudang}
                    />
                  </Col>

                  <Col xs={8} md={2}>
                    <Label>Area Jualan</Label>
                  </Col>
                  <Col xs={8} md={2}>
                    <Input
                        onChange={evt=> this.editAreaJualan(evt)}
                        type="number"
                        value={this.state.resultEyeout_luasareajualan}
                    />
                  </Col>
                </Row>

                <Card outline color="primary">
                  <CardBody>
                    <Row className="show-grid ">
                      <Col xs={1} md={1}></Col>
                      <Col xs={4} md={4}>
                        <Label>Tanggal Buka</Label>
                      </Col>
                      <Col xs={1} md={1}></Col>
                      <Col xs={4} md={4}>
                        <Label>Tanggal Tutup</Label>
                      </Col>
                    </Row>

                    <Row className="show-grid ">
                      <Col xs={1} md={1}></Col>
                      <Col xs={4} md={4}>
                        <FormGroup>
                          <Input
                            type="date"
                            onChange={evt =>
                              this.startDateInputChangeEdit(evt)
                            }
                            id="tanggalBuka"
                            name="tanggalBuka"
                            required
                            class="datepicker-input"
                            value={this.state.dateopen}
                            disabled={this.state.dateOpenIsNull &&this.state.dateOpenValueEdit}
                            invalid={this.state.dateopenInvalid}
                            valid={this.state.dateopenValid}
                          ></Input>
                        </FormGroup>
                      </Col>
                      <Col xs={1} md={1}>
                      <MdWarning
                        className={this.state.mdWarning + ' mt-2'}
                        color="#fee12b"
                        id="UncontrolledTooltipExample"
                        size="25px"
                      ></MdWarning>

                      <UncontrolledTooltip
                        placement="right"
                        target="UncontrolledTooltipExample"
                      >
                        Tanggal Buka tidak boleh kurang dari 14 hari
                      </UncontrolledTooltip>
                    </Col>
                      <Col xs={4} md={4}>
                        <Input
                          onChange={evt =>
                            this.endDateInputChangeEdit(evt)
                          }
                          type="date"
                          id="tanggalTutup"
                          name="tanggalTutup"
                          defaultValue={dateClose}
                          value={this.state.dateclose}
                          disabled={this.state.dateOpenValueEdit && this.state.dateCloseValueEdit}
                          invalid={this.state.datecloseInvalid}
                          valid={this.state.datecloseValid}
                        ></Input>
                      </Col>
                      
                    </Row>
                    <Row  >
                    <Col xs={1} md={1}></Col>
                  
                    <Col xs={4} md={4}>
                        <Label>Jam Tutup</Label>
                      </Col>
                      <Col xs={1} md={1}></Col>
                      <Col xs={4} md={4}>
                  
                      <Input
                      type = "time"
                      onChange={evt => this.edittimecloseValue(evt)}
                      value={this.state.out_timeclose}
                >
                </Input>
                    </Col>
                      
                    </Row>
                    
                   
                  </CardBody>
                </Card>

                <Collapse id="collapseOpened" isOpen={this.state.collapse}>
                  <Card outline color="primary">
                    <CardBody>
                      <Row className="show-grid">
                        <Col xs={8} md={4}>
                          <Label>Kepemilikan</Label>
                        </Col>

                        <Col xs={2} md={4}>
                          <Input
                            onChange={evt =>
                              this.editjeniskepemilikanValue(evt)
                            }
                          
                            value={this.state.out_jeniskepemilikan}
                            type="select"
                          >
                            {this.state.JenisKepemilikans.map(
                              JenisKepemilikan => (
                                <option
                                  key={JenisKepemilikan.value}
                                  value={JenisKepemilikan.value}
                                >
                                  {JenisKepemilikan.display}
                                </option>
                              ),
                            )}
                          </Input>
                        </Col>
                      </Row>

                      <Row className="show-grid  ">
                        <Col xs={8} md={4}>
                          <Label>NPWP</Label>
                        </Col>
                        <Col xs={8} md={4}>
                          <Label>PPN</Label>
                        </Col>
                        <Col xs={8} md={4}>
                          <Label>PPH21</Label>
                        </Col>
                      </Row>

                      <Row className="show-grid mt-1">
                        <Col xs={8} md={4}></Col>
                        <Col xs={8} md={4}>
                          <Input
                        
                            mask="99.999.999.9-999-999"
                            onChange={evt => this.editnpwpValue(evt)}
                            value={this.state.resultEyeout_npwp}
                            tag={InputMask}
                          ></Input>
                        </Col>
                        <Col xs={8} md={4}>
                          <Input
                   
                            mask="99.999.999.9-999-999"
                            value={this.state.resultEyeout_npwppph}
                            tag={InputMask}
                            onChange={evt => this.editnpwppphValue(evt)}
                          ></Input>
                        </Col>
                      </Row>

                      <Row className="show-grid mt-1">
                        <Col xs={8} md={4}>
                          <Label>Schedule Input Deposit</Label>
                        </Col>
                        <Col xs={2} md={4}>
                          <FormGroup>
                            <Input
           
                              type="select"
                              name="select"
                              id="exampleSelect"
                              onChange={evt =>
                                this.editscheduleDepositValue(evt)
                              }
                              value={this.state.out_jnsdeposit}
                            >
                              {this.state.JenisDepositBatchs.map(
                                JenisDepositBatch => (
                                  <option
                                    key={JenisDepositBatch.value}
                                    value={JenisDepositBatch.value}
                                  >
                                    {JenisDepositBatch.display}
                                  </option>
                                ),
                              )}
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>

                  <Card outline color="primary">
                    <CardBody>
                      <Row className="show-grid">
                        <Col xs={8} md={4}>
                          <Label>Schedule RO</Label>
                        </Col>
                        <Col xs={4} md={4}>
                          <Input
                        
                            onChange={evt => this.editscheduleroValue(evt)}
                            type="select"
                            value={this.state.out_schedulero}
                          >
                            {this.state.JenisScheduleROs.map(schedule => (
                              <option
                                key={schedule.value}
                                value={schedule.value}
                              >
                                {schedule.display}
                              </option>
                            ))}
                          </Input>
                        </Col>
                      </Row>

                      <Row className="mt-3 ">
                        <Col xs={3} md={3}>
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <Input
                                  disabled
                                  value={
                                    this.state.resultEyeout_schedulerosenin
                                  }
                                  checked={this.state.resultEyeout_jaminynSenin}
                                  id="jaminYNChecbox"
                                  addon
                                  type="checkbox"
                                />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input disabled placeholder="Senin"></Input>
                          </InputGroup>
                        </Col>

                        <Col xs={3} md={3}>
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <Input
                                disabled
                                  value={
                                    this.state.resultEyeout_scheduleroselasa
                                  }
                                  checked={
                                    this.state.resultEyeout_jaminynSelasa
                                  }
                                  id="jaminYNChecbox"
                                  addon
                                  type="checkbox"
                                />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input disabled placeholder="Selasa"></Input>
                          </InputGroup>
                        </Col>

                        <Col xs={3} md={3}>
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <Input
                                disabled
                                  value={this.state.resultEyeout_schedulerorabu}
                                  checked={this.state.resultEyeout_jaminynRabu}
                                  id="jaminYNChecbox"
                                  addon
                                  type="checkbox"
                                />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input disabled placeholder="Rabu"></Input>
                          </InputGroup>
                        </Col>

                        <Col xs={3} md={3}>
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <Input
                                  disabled
                                  value={
                                    this.state.resultEyeout_schedulerokamis
                                  }
                                  checked={this.state.resultEyeout_jaminynKamis}
                                  id="jaminYNChecbox"
                                  addon
                                  type="checkbox"
                                />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input disabled placeholder="Kamis"></Input>
                          </InputGroup>
                        </Col>
                        <Col xs={3} md={3}></Col>

                        <Col xs={3} md={3}>
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <Input
                                  disabled
                                  value={
                                    this.state.resultEyeout_schedulerojumat
                                  }
                                  checked={this.state.resultEyeout_jaminynJumat}
                                  id="jaminYNChecbox"
                                  addon
                                  type="checkbox"
                                />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input disabled placeholder="Jumat"></Input>
                          </InputGroup>
                        </Col>

                        <Col xs={3} md={3}>
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <Input
                                  disabled
                                  value={
                                    this.state.resultEyeout_schedulerosabtu
                                  }
                                  checked={this.state.resultEyeout_jaminynSabtu}
                                  id="jaminYNChecbox"
                                  addon
                                  type="checkbox"
                                />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input disabled placeholder="Sabtu"></Input>
                          </InputGroup>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>

                  <Row className="show-grid ">
                    <Col xs={8} md={4}>
                      <Label>Dijaminkan</Label>
                    </Col>
                    <Col xs={8} md={4}>
                      <Label>Class</Label>
                    </Col>
                    <Col xs={8} md={4}>
                      <Label>Class Special</Label>
                    </Col>
                  </Row>
                  <Row className="show-grid ">
                    <Col xs={4} md={4}>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <Input
                           
                              name="pjkoutyn1"
                              type="checkbox"
                              checked={this.state.pjkoutyn1checked}
                              value={this.state.resultEyeout_jaminyn}
                              onClick={event => this.editJaminYN(event)}
                              id="jaminYNChecbox"
                              addon
                            />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          onChange={evt => this.jaminketYN(evt)}
                          disabled={this.state.inputEditJaminYN}
                          id="jaminYNInput"
                          value={this.state.resultEyeout_jaminynKet}
                        />
                      </InputGroup>
                    </Col>

                    <Col xs={4} md={4}>
                      <Input
                        type="select"
                        onChange={evt => this.editclassValue(evt)}
                        value={this.state.out_class}
                
                      >
                        <option style={{ display: 'none' }}>SELECT</option>
                        <option>A</option>
                        <option>B</option>
                        <option>C</option>
                      </Input>
                    </Col>
                    <Col xs={4} md={4}>
                      <Input
          
                        type="select"
                        onChange={evt => this.editspecial_namaValue(evt)}
                        value={this.state.out_classspecial}
                      >
                        {this.state.JenisClassSpecials.map(
                          JenisClassSpecial => (
                            <option
                              key={JenisClassSpecial.value}
                              value={JenisClassSpecial.value}
                            >
                              {JenisClassSpecial.display}
                            </option>
                          ),
                        )}
                      </Input>
                    </Col>
                  </Row>

                  <Row className="show-grid  ">
                  <Col xs={5} md={4}>
                    <Label>Jumlah PC</Label>
                  </Col>
                 
                  <Col xs={5} md={4}>
                  <Label>Ronaldo</Label>
                </Col>
                </Row>

                <Row className="show-grid  ">

                <Col className="mt-1" xs={5} md={4}>
                <Input
                disabled
                id="jumlahPC"
                type="number"
                max="3"
                onChange={evt => this.insertJumlahPC(evt) }
                value={this.state.out_jumpc}
                >
                
                </Input>
                </Col>
                <Col className="mt-1" xs={3} md={3}>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <Input


                      
                      name="resultEyeout_robotgdyn"
                        id="ronaldoYN"
                        type="checkbox"
                        addon
                        checked={this.state.resultEyeout_robotgdynChecked}
                        onClick={event => this.editRonaldo(event)}
                        value={this.state.resultEyeout_robotgdyn}
                      ></Input>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input disabled placeholder="Ronaldo"></Input>
                </InputGroup>
              </Col>
               
                </Row>


                </Collapse>
                <Button
                  id="expandMore"
                  color="primary"
                  size="sm"
                  onClick={this.toggleCollapseMore}
                  style={{ marginBottom: '20px', marginTop: '25px' }}
                  block
                >
                  <MdExpandMore></MdExpandMore>
                </Button>
                <Button
                  id="expandLess"
                  color="primary"
                  size="sm"
                  onClick={this.toggleCollapseLess}
                  style={{
                    marginBottom: '20px',
                    marginTop: '25px',
                    display: 'none',
                  }}
                  block
                >
                  <MdExpandLess></MdExpandLess>
                </Button>
              </ModalBody>

              <ModalFooter>
                <Button
                  disabled={this.state.buttonSimpanEdit}
                  onChange
                  id="buttonSimpanEdit"
                  color="primary"
                  onClick={() => this.validationEdit()}
                >
                  Simpan
                </Button>
                <Modal
                  isOpen={this.state.modal_nested}
                  toggle={this.toggle('nested')}
                >
                  <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                  <ModalBody>
                    Apakah Anda yakin ingin mengubah data ini?
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      disabled={isLoading}
                      color="primary"
                      onClick={this.editOutlet()}
                    >
                      Ya
                    </Button>{' '}
                    <Button color="primary" onClick={this.toggle('nested')}>
                      Tidak
                    </Button>
                  </ModalFooter>
                </Modal>{' '}
                <Button color="primary" onClick={this.toggle('update')}>
                  Batal
                </Button>
              </ModalFooter>
            </Modal>
          </CardHeader>
          {/* ======================================KETIKA INSERT DATA NOTELP ============================== */}
          <Modal
            isOpen={this.state.modal_inputtelp}
            toggle={this.toggle('inputtelp')}
            className={this.props.className}
          >
            <ModalHeader toggle={this.toggle('inputtelp')}>
              Nomor Telpon
            </ModalHeader>
            <ModalBody>
              <Table>
                <tr align="center">
                  <th class="th-sm">OutCode</th>
                  <th class="th-sm">Kode Area</th>
                  <th class="th-sm">Nomor Telepon</th>
                  <th class="th-sm"></th>
                  <th class="th-sm"></th>
                </tr>

                <tbody>
                  {resultTelp.map(out => (
                    <tr align="center">
                      <td>{out.telout_outcode}</td>
                      <td>{out.telout_areacode}</td>
                      <td>{out.telout_number}</td>
                      {out.telout_activeyn === 'Y' && (
                        <td>
                          <Button
                            style={{
                              background: '#FF0000',
                              borderStyle: 'none',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            size="sm"
                            onClick={() =>
                              this.openModalTelpDelete(out.telout_runningid)
                            }
                          >
                            <MdDelete></MdDelete>
                          </Button>
                        </td>
                      )}

                      {/* ====================================== EDIT ============================== */}
                      {out.telout_activeyn === 'Y' && (
                        <td>
                          <Button
                            color="warning"
                            size="sm"
                            onClick={() =>
                              this.updateModalWithItemID(
                                out.telout_outcode,
                                out.telout_areacode,
                                out.telout_number,
                                out.telout_runningid,
                              )
                            }
                          >
                            EDIT
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
                {/* ====================================== Tambah TELP ============================== */}
              </Table>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                size="35px"
                onClick={this.toggle('nested_tambahtelp')}
              >
                <MdAdd></MdAdd>
              </Button>
              <Modal
                isOpen={this.state.modal_nested_tambahtelp}
                toggle={this.toggle('nested_tambahtelp')}
              >
                <ModalHeader>No Telp</ModalHeader>
                <ModalBody>
                  <Row className="show-grid  mt-3">
                    <Col xs={8} md={4}>
                      <Label>Kode Area</Label>
                    </Col>
                    <Col xs={8} md={4}>
                      <Label>Nomor Telepon</Label>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={8} md={4}>
                      <Input
                        value={this.state.resultKodeTelp}
                        disabled
                        maxLength="4"
                        onChange={evt => this.insertInputValue(evt)}
                      ></Input>
                    </Col>
                    <Col xs={8} md={8}>
                      <Input
                        value={this.state.numberTelp}
                        placeholder="Nomor Telepon"
                        onChange={evt => this.insertInputTelpValue(evt)}
                        maxLength="14"
                      ></Input>
                    </Col>
                  </Row>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    onClick={this.toggle('nested_tambahtelp_confirm')}
                  >
                    {!isLoading && <i className="fa fa-refresh fa-spin"></i>}
                    Simpan
                  </Button>{' '}
                  <Button
                    color="primary"
                    onClick={this.toggle('nested_tambahtelp')}
                  >
                    Batal
                  </Button>
                </ModalFooter>
              </Modal>{' '}
              <Modal
                isOpen={this.state.modal_nested_tambahtelp_confirm}
                toggle={this.toggle('nested_tambahtelp_confirm')}
                onExit={this.handleClose}
              >
                ><ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                <ModalBody>
                  Apakah Anda yakin ingin menyimpan data ini?
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    onClick={this.addTelpon(
                      this.state.resultKodeTelp,
                      this.state.numberTelp,
                    )}
                    disabled={isLoading}
                  >
                    {!isLoading && <i className="fa fa-refresh fa-spin"></i>}
                    Ya
                  </Button>{' '}
                  <Button color="primary" onClick={this.toggle('inputtelp')}>
                    Tidak
                  </Button>
                </ModalFooter>
              </Modal>{' '}
              <Button color="primary" onClick={this.toggle('inputtelp')}>
                KELUAR
              </Button>
            </ModalFooter>
          </Modal>
          <Modal
            isOpen={this.state.modal_update_telp}
            toggle={this.toggle('update_telp')}
          >
            <ModalHeader>Edit No Telp</ModalHeader>
            <ModalBody>
              <Row className="show-grid  mt-3">
                <Col xs={8} md={4}>
                  <Label>Kode Area</Label>
                </Col>
                <Col xs={8} md={4}>
                  <Label>Nomor Telepon</Label>
                </Col>
              </Row>
              <Row>
                <Col xs={8} md={4}>
                  <Input
                    value={this.state.telout_areacode}
                    disabled
                    maxLength="4"
                    onChange={evt => this.insertInputValue(evt)}
                  ></Input>
                </Col>
                <Col xs={8} md={8}>
                  <Input
                    value={this.state.telout_number}
                    placeholder="Nomor Telepon"
                    onChange={evt => this.insertInputTelpValue(evt)}
                    maxLength="14"
                  ></Input>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={() => this.editTelpon()}>
                Simpan
              </Button>{' '}
              <Button color="primary" onClick={this.toggle('update_telp')}>
                Batal
              </Button>
            </ModalFooter>
          </Modal>{' '}
          <CardBody>
            <Table
              responsive
              id="selectedColumn"
              class="table table-striped table-bordered table-sm"
              cellspacing="0"
              width="100%"
            >
              {/* ======================================KETIKA EYE VIEW /  MELIHAT ============================== */}

              <Modal
                isOpen={this.state.modal_view}
                toggle={this.toggle('view')}
                className={this.props.className + ' modal-dialog-scrollable'}
                onExit={this.handleClose}
                onClosed={this.handleClose}
                size="lg"
              >
                <ModalHeader
                  toggle={this.toggle('view')}
                  onExit={this.handleClose}
                >
                  Detail
                </ModalHeader>
                
                <ModalBody>
                <Card outline color="primary">
                  <CardBody>
                    <Row className="show-grid ">
                      <Col xs={8} md={4}>
                        <Label>Outlet ID</Label>
                      </Col>
                      <Col xs={2} md={4}>
                        <Label>Jenis Area</Label>
                      </Col>
                      <Col xs={2} md={4}>
                        <Label>Jenis Outlet</Label>
                      </Col>
                    </Row>
                    <Row className="show-grid ">
                      <Col xs={8} md={4}>
                        <Input
                          type="namaekspedisi"
                          disabled
                          value={this.state.resultEyeout_code}
                        />
                      </Col>

                      <Col xs={2} md={4}>
                        <Input
                        disabled
                          onChange={evt => this.editjnsareaValue(evt)}
                          type="select"
                          value={this.state.out_jnsarea}
            
                        >
                          {this.state.JenisAreas.map(JenisArea => (
                            <option
                              key={JenisArea.value}
                              value={JenisArea.value}
                            >
                              {JenisArea.display}
                            </option>
                          ))}
                        </Input>
                      </Col>

                      <Col xs={2} md={4}>
                        <Input
                          onChange={evt => this.editjenisoutletValue(evt)}
                          type="select"
                          value={this.state.out_jenisoutlet}
                          disabled
                        >
                          {this.state.outlets.map(outlet => (
                            <option key={outlet.value} value={outlet.value}>
                              {outlet.display}
                            </option>
                          ))}
                        </Input>
                      </Col>
                    </Row>

                    <Row className="show-grid mt-1 ">
                      <Col xs={4} md={4}>
                        <Label>Outlet Name</Label>
                      </Col>
                      <Col xs={4} md={8}>
                        <Input
                          disabled
                          onChange={evt => this.editOutletName(evt)}
                          type="text"
                          value={this.state.out_names}
                        ></Input>
                      </Col>
                    </Row>

<Row className='d-flex justify-content-center mt-2'>

<Col xs={3} md={3}>
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <Input
                                  disabled
                                  value={
                                    this.state.out_allowcredityn
                                  }
                                  name="out_allowcredityn"
                                  onClick={event => this.editAllowCredit(event)}
                                  checked={this.state.out_allowcreditynChecked}
                                  addon
                                  type="checkbox"
                                />

                              </InputGroupText>
                            </InputGroupAddon>
                            <Input disabled placeholder="AllowCredit"></Input>
                          </InputGroup>
                          </Col>
                        
<Col xs={3} md={3}>
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <Input
                                name="out_perjanjianyn"
                                  disabled
                                  value={
                                    this.state.out_perjanjianyn
                                  }
                                  onClick={event => this.editAllowPerjanjian(event)}
                                  checked={this.state.out_perjanjianynChecked}
                                  id="perjanjianYNChecbox"
                                  addon
                                  type="checkbox"
                                />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input disabled placeholder="Ada Perjanjian"></Input>
                          </InputGroup>
                        </Col>
 
</Row>





                  </CardBody>
                </Card>

                <Row className="show-grid">
                  <Col xs={5} md={5}>
                    <Label>Alamat</Label>
                  </Col>
                  <Col xs={3} md={4}>
                    <Label>Kota</Label>
                  </Col>
                  <Col xs={3} md={3}>
                    <Label>Kode Pos</Label>
                  </Col>
                </Row>
                <Row className="show-grid">
                  <Col xs={8} md={5}>
                    <Input
                      disabled
                      onChange={evt => this.editaddressValue(evt)}
                      type="textarea"
                      value={this.state.out_address}
                    />
                  </Col>

                  <Col xs={4} md={4}>
                    <Input
                      disabled
                      onChange={evt => this.editcitycodeValue(evt)}
                      type="select"
                      maxLength="3"
                      value={this.state.out_citycode}
                    >
                      {this.state.Kotas.map(kota => (
                        <option key={kota.value} value={kota.value}>
                          {kota.display}
                        </option>
                      ))}
                    </Input>
                  </Col>

                  <Col xs={3} md={3}>
                    <Input
                      disabled
                      onChange={evt => this.editpostalcodeValue(evt)}
                      type="namaekspedisi"
                      maxLength="5"
                      placeholder="Postal Code"
                      value={this.state.postalcode}
                    />
                  </Col>
                </Row>


                
                <Row className="show-grid mt-2">
                <Col xs={4} md={4}>
                  <Label>Email</Label>
                 
                </Col>
                <Col xs={8} md={8}>
                <Input
                placeholder = "Email"
                disabled
                type="Email"
                onChange={evt => this.onChangeEmail(evt)}
                value={this.state.out_email}
              />
              </Col>
               

              </Row>
                <Row className="show-grid mt-2">
                <Col xs={4} md={4}>
                  <Label>Jenis Stocktake</Label>
                </Col>

                <Col xs={4} md={4}>
                <Label>Fax</Label>
              </Col>

              </Row>

                <Row className="show-grid">
                  
                  <Col xs={4} md={4}>
                    <Input
                      disabled
                      onChange={evt => this.editjenisStocktakeValue(evt)}
                      maxLength="2"
                      type="select"
                      value={this.state.out_jnssttk}
                    >
                      {this.state.JenisStockTakes.map(JenisStockTake => (
                        <option
                          key={JenisStockTake.value}
                          value={JenisStockTake.value}
                        >
                          {JenisStockTake.display}
                        </option>
                      ))}
                    </Input>
                  </Col>


                  <Col xs={4} md={4}>
                  <Input
                    placeholder = "Fax"
                   disabled
                    type="fax"
                    value={this.state.out_fax}
                  />
                </Col>
                </Row>

                <Row className="show-grid  mt-3">
                  <Col xs={8} md={2}>
                    <Label>Luas Total</Label>
                  </Col>
                  <Col xs={8} md={2}>
                    <Input
                      disabled
                      type="namaekspedisi"
                      value={this.state.resultEyeout_square}
                    />
                  </Col>
                  <Col xs={8} md={2}>
                    <Label>Gudang</Label>
                  </Col>
                  <Col xs={8} md={2}>
                    <Input
                    disabled
                      type="namaekspedisi"
                      value={this.state.resultEyeout_luasgudang}
                    />
                  </Col>

                  <Col xs={8} md={2}>
                    <Label>Area Jualan</Label>
                  </Col>
                  <Col xs={8} md={2}>
                    <Input
                      disabled
                      type="namaekspedisi"
                      value={this.state.resultEyeout_luasareajualan}
                    />
                  </Col>
                </Row>

                <Card outline color="primary">
                  <CardBody>
                    <Row className="show-grid ">
                      <Col xs={1} md={1}></Col>
                      <Col xs={4} md={4}>
                        <Label>Tanggal Buka</Label>
                      </Col>
                      <Col xs={1} md={1}></Col>
                      <Col xs={4} md={4}>
                        <Label>Tanggal Tutup</Label>
                      </Col>
                    </Row>

                    <Row className="show-grid ">
                      <Col xs={1} md={1}></Col>
                      <Col xs={4} md={4}>
                        <FormGroup>
                          <Input
                            type="date"
                            onChange={evt =>
                              this.startDateInputChangeEdit(evt)
                            }
                            id="tanggalBuka"
                            name="tanggalBuka"
                            required
                            class="datepicker-input"
                            value={this.state.dateopen}
                            disabled
                            invalid={this.state.dateopenInvalid}
                            valid={this.state.dateopenValid}
                          ></Input>
                        </FormGroup>
                      </Col>
                      <Col xs={1} md={1}>
                      <MdWarning
                        className={this.state.mdWarning + ' mt-2'}
                        color="#fee12b"
                        id="UncontrolledTooltipExample"
                        size="25px"
                      ></MdWarning>

                      <UncontrolledTooltip
                        placement="right"
                        target="UncontrolledTooltipExample"
                      >
                        Tanggal Buka tidak boleh kurang dari 14 hari
                      </UncontrolledTooltip>
                    </Col>
                      <Col xs={4} md={4}>
                        <Input
                          onChange={evt =>
                            this.endDateInputChangeEdit(evt)
                          }
                          type="date"
                          id="tanggalTutup"
                          name="tanggalTutup"
                          defaultValue={dateClose}
                          value={this.state.dateclose}
                          disabled
                          invalid={this.state.datecloseInvalid}
                          valid={this.state.datecloseValid}
                        ></Input>
                      </Col>
                      
                    </Row>
                  </CardBody>
                </Card>

                <Collapse id="collapseOpened" isOpen={this.state.collapse}>
                  <Card outline color="primary">
                    <CardBody>
                      <Row className="show-grid">
                        <Col xs={8} md={4}>
                          <Label>Kepemilikan</Label>
                        </Col>

                        <Col xs={2} md={4}>
                          <Input
                            onChange={evt =>
                              this.editjeniskepemilikanValue(evt)
                            }
                            disabled
                            value={this.state.out_jeniskepemilikan}
                            type="select"
                          >
                            {this.state.JenisKepemilikans.map(
                              JenisKepemilikan => (
                                <option
                                  key={JenisKepemilikan.value}
                                  value={JenisKepemilikan.value}
                                >
                                  {JenisKepemilikan.display}
                                </option>
                              ),
                            )}
                          </Input>
                        </Col>
                      </Row>

                      <Row className="show-grid  ">
                        <Col xs={8} md={4}>
                          <Label>NPWP</Label>
                        </Col>
                        <Col xs={8} md={4}>
                          <Label>PPN</Label>
                        </Col>
                        <Col xs={8} md={4}>
                          <Label>PPH21</Label>
                        </Col>
                      </Row>

                      <Row className="show-grid mt-1">
                        <Col xs={8} md={4}></Col>
                        <Col xs={8} md={4}>
                          <Input
                            disabled
                            mask="99.999.999.9-999-999"
                            onChange={evt => this.editnpwpValue(evt)}
                            value={this.state.resultEyeout_npwp}
                            tag={InputMask}
                          ></Input>
                        </Col>
                        <Col xs={8} md={4}>
                          <Input
                            disabled
                            mask="99.999.999.9-999-999"
                            value={this.state.resultEyeout_npwppph}
                            tag={InputMask}
                            onChange={evt => this.editnpwppphValue(evt)}
                          ></Input>
                        </Col>
                      </Row>

                      <Row className="show-grid mt-1">
                        <Col xs={8} md={4}>
                          <Label>Schedule Input Deposit</Label>
                        </Col>
                        <Col xs={2} md={4}>
                          <FormGroup>
                            <Input
                              disabled
                              type="select"
                              name="select"
                              id="exampleSelect"
                              onChange={evt =>
                                this.editscheduleDepositValue(evt)
                              }
                              value={this.state.out_jnsdeposit}
                            >
                              {this.state.JenisDepositBatchs.map(
                                JenisDepositBatch => (
                                  <option
                                    key={JenisDepositBatch.value}
                                    value={JenisDepositBatch.value}
                                  >
                                    {JenisDepositBatch.display}
                                  </option>
                                ),
                              )}
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>

                  <Card outline color="primary">
                    <CardBody>
                      <Row className="show-grid">
                        <Col xs={8} md={4}>
                          <Label>Schedule RO</Label>
                        </Col>
                        <Col xs={4} md={4}>
                          <Input
                            disabled
                            onChange={evt => this.editscheduleroValue(evt)}
                            type="select"
                            value={this.state.out_schedulero}
                          >
                            {this.state.JenisScheduleROs.map(schedule => (
                              <option
                                key={schedule.value}
                                value={schedule.value}
                              >
                                {schedule.display}
                              </option>
                            ))}
                          </Input>
                        </Col>
                      </Row>

                      <Row className="mt-3 ">
                        <Col xs={3} md={3}>
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <Input
                                  disabled
                                  value={
                                    this.state.resultEyeout_schedulerosenin
                                  }
                                  checked={this.state.resultEyeout_jaminynSenin}
                                  id="jaminYNChecbox"
                                  addon
                                  type="checkbox"
                                />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input disabled placeholder="Senin"></Input>
                          </InputGroup>
                        </Col>

                        <Col xs={3} md={3}>
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <Input
                                disabled
                                  value={
                                    this.state.resultEyeout_scheduleroselasa
                                  }
                                  checked={
                                    this.state.resultEyeout_jaminynSelasa
                                  }
                                  id="jaminYNChecbox"
                                  addon
                                  type="checkbox"
                                />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input disabled placeholder="Selasa"></Input>
                          </InputGroup>
                        </Col>

                        <Col xs={3} md={3}>
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <Input
                                disabled
                                  value={this.state.resultEyeout_schedulerorabu}
                                  checked={this.state.resultEyeout_jaminynRabu}
                                  id="jaminYNChecbox"
                                  addon
                                  type="checkbox"
                                />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input disabled placeholder="Rabu"></Input>
                          </InputGroup>
                        </Col>

                        <Col xs={3} md={3}>
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <Input
                                  disabled
                                  value={
                                    this.state.resultEyeout_schedulerokamis
                                  }
                                  checked={this.state.resultEyeout_jaminynKamis}
                                  id="jaminYNChecbox"
                                  addon
                                  type="checkbox"
                                />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input disabled placeholder="Kamis"></Input>
                          </InputGroup>
                        </Col>
                        <Col xs={3} md={3}></Col>

                        <Col xs={3} md={3}>
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <Input
                                  disabled
                                  value={
                                    this.state.resultEyeout_schedulerojumat
                                  }
                                  checked={this.state.resultEyeout_jaminynJumat}
                                  id="jaminYNChecbox"
                                  addon
                                  type="checkbox"
                                />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input disabled placeholder="Jumat"></Input>
                          </InputGroup>
                        </Col>

                        <Col xs={3} md={3}>
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <Input
                                  disabled
                                  value={
                                    this.state.resultEyeout_schedulerosabtu
                                  }
                                  checked={this.state.resultEyeout_jaminynSabtu}
                                  id="jaminYNChecbox"
                                  addon
                                  type="checkbox"
                                />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input disabled placeholder="Sabtu"></Input>
                          </InputGroup>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>

                  <Row className="show-grid ">
                    <Col xs={8} md={4}>
                      <Label>Dijaminkan</Label>
                    </Col>
                    <Col xs={8} md={4}>
                      <Label>Class</Label>
                    </Col>
                    <Col xs={8} md={4}>
                      <Label>Class Special</Label>
                    </Col>
                  </Row>
                  <Row className="show-grid ">
                    <Col xs={4} md={4}>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <Input
                              disabled
                              name="pjkoutyn1"
                              type="checkbox"
                              checked={this.state.pjkoutyn1checked}
                              value={this.state.resultEyeout_jaminyn}
                              onClick={event => this.editJaminYN(event)}
                              id="jaminYNChecbox"
                              addon
                            />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          onChange={evt => this.jaminketYN(evt)}
                          disabled
                          id="jaminYNInput"
                          value={this.state.resultEyeout_jaminynKet}
                        />
                      </InputGroup>
                    </Col>

                    <Col xs={4} md={4}>
                      <Input
                        type="select"
                        onChange={evt => this.editclassValue(evt)}
                        value={this.state.out_class}
                        disabled
                      >
                        <option style={{ display: 'none' }}>SELECT</option>
                        <option>A</option>
                        <option>B</option>
                        <option>C</option>
                      </Input>
                    </Col>
                    <Col xs={4} md={4}>
                      <Input
                        disabled
                        type="select"
                        onChange={evt => this.editspecial_namaValue(evt)}
                        value={this.state.out_classspecial}
                      >
                        {this.state.JenisClassSpecials.map(
                          JenisClassSpecial => (
                            <option
                              key={JenisClassSpecial.value}
                              value={JenisClassSpecial.value}
                            >
                              {JenisClassSpecial.display}
                            </option>
                          ),
                        )}
                      </Input>
                    </Col>
                  </Row>

                  <Row className="show-grid  ">
                  <Col xs={5} md={4}>
                    <Label>Jumlah PC</Label>
                  </Col>
                
                  
                </Row>
 
                <Row className="show-grid  ">

                <Col className="mt-1" xs={5} md={4}>
                <Input
                disabled
                id="jumlahPC"
                type="number"
                max="3"
                onChange={evt => this.insertJumlahPC(evt) }
                value={this.state.out_jumpc}
                >
                
                </Input>
                </Col>

                

                </Row>


                </Collapse>
                <Button
                  id="expandMore"
                  color="primary"
                  size="sm"
                  onClick={this.toggleCollapseMore}
                  style={{ marginBottom: '20px', marginTop: '25px' }}
                  block
                >
                  <MdExpandMore></MdExpandMore>
                </Button>
                <Button
                  id="expandLess"
                  color="primary"
                  size="sm"
                  onClick={this.toggleCollapseLess}
                  style={{
                    marginBottom: '20px',
                    marginTop: '25px',
                    display: 'none',
                  }}
                  block
                >
                  <MdExpandLess></MdExpandLess>
                </Button>
              </ModalBody>

              </Modal>

              {/* ====================================== TABLE DATA DIMANA LIST DATA YANG MUNCUL (TELAH DI DAPAT DR DATABASE)============================= */}
              <thead>
                <tr align="center">
                  <th className="th-sm">Nama</th>
                  <th class="th-sm">Alamat</th>
                  <th class="th-sm">Jam Tutup</th>
                  <th class="th-sm">Kontak</th>
                  <th class="th-sm"></th>
                  <th class="th-sm"></th>
                  <th class="th-sm"></th>
                </tr>
              </thead>
              <tbody>
                {result.map(out => (
                  <tr>
                    {/* =====Nama===== */}
                    <td>
                      <div class="d-flex justify-center">{out.out_code}</div>
                      <div class="d-flex justify-center">{out.out_name}</div>
                    </td>

                    {/* =====Alamat===== */}
                    <td>
                      <div class="d-flex justify-center">{out.out_address}</div>

                      <div class="d-flex justify-center">{out.kota_name}</div>

                      <div class="d-flex justify-center">
                        {out.out_postalcode}
                      </div>
                    </td>

                    {/* =====Jam tutup===== */}
                    <td>
                      <div>{out.out_timeclose}</div>
                    </td>

                    {/* =====Kontak===== */}
                    <td>
                      <div class="d-flex justify-center">{out.out_fax}</div>
                      <div>{out.out_email}</div>
                    </td>

                    {/* ====================================== EDIT ============================== */}
                    {out.out_activeyn === 'Y' && (
                      <td>
                        <Button
                          style={{
                            borderStyle: 'none',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          color="warning"
                          size="sm"
                          onClick={() => this.getListbyEdit(out.out_code)}
                        >
                          <MdModeEdit></MdModeEdit>
                        </Button>
                        <Button
                          style={{
                            background: '#FF0000',
                            borderStyle: 'none',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          size="sm"
                          onClick={() =>
                            this.openModalWithItemID(out.out_code, out.out_name)
                          }
                        >
                          <MdDelete></MdDelete>
                        </Button>
                      </td>
                    )}
                    {/* ====================================== EYE FOR VIEW ============================== */}

                    {out.out_activeyn === 'Y' && (
                      <td>
                        <MdCall
                          color="danger"
                          style={{ marginRight: '7px', cursor: 'pointer' }}
                          size="25px"
                          onClick={() =>
                            this.viewModalTelp(
                              out.out_jnsarea,
                              out.out_square,
                              out.out_code,
                              out.kota_kodetelp,
                            )
                          }
                        ></MdCall>

                        <MdVisibility
                          style={{ marginRight: '7px', cursor: 'pointer' }}
                          color="warning"
                          size="25px"
                          onClick={() => this.getListbyEye(out.out_code)}
                        ></MdVisibility>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
            <Row>
              {/* ====================================== PEMBERIAN LIMIT DATA PER HALAMAN============================== */}
              <Col md="6" sm="12" xs="12">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    Data per Halaman
                  </InputGroupAddon>
                  <select
                    name="todosPerPage"
                    style={{ height: '38px' }}
                    value={this.state.value}
                    onChange={e => this.handleSelect(e)}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                  </select>
                </InputGroup>
              </Col>

              <Col md="6" sm="12" xs="12" f>
                <InputGroup style={{ width: '243px' }}>
                  <div className="input-group-prepend">
                    {/* ====================================== FIRST PAGE ==================== */}
                    <Button
                      style={{
                        background: '#2CB7A4',
                        borderStyle: 'none',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      className="btn btn-info"
                      value={this.state.currentPage}
                      onClick={e => this.handleFirst(e, -1)}
                    >
                      &lt;&lt;
                    </Button>
                    {/* ====================================== BACK ============================== */}
                    <Button
                      style={{
                        background: '#2CB7A4',
                        borderStyle: 'none',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      className="btn btn-info"
                      value={this.state.currentPage}
                      onClick={e => this.handleWrite(e, -1)}
                    >
                      &lt;
                    </Button>
                  </div>

                  <span
                    className="text-muted p-2 "
                    style={{
                      height: '10px',
                      width: '100px',
                      textAlign: 'center',
                    }}
                  >
                    {this.state.currentPage + 1}
                  </span>
                  {/* ====================================== NEXT  ============================== */}
                  <div className="input-group-append">
                    <Button
                      style={{
                        background: '#2CB7A4',
                        borderStyle: 'none',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      className="btn btn-info"
                      value={this.state.currentPage}
                      onClick={e => this.handleWrite(e, 1)}
                    >
                      &gt;
                    </Button>
                    {/* ====================================== LAST PAGE  ========================== */}
                    <Button
                      style={{
                        background: '#2CB7A4',
                        borderStyle: 'none',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      className="btn btn-info"
                      value={this.state.currentPage}
                      onClick={e => this.handleLast(e)}
                    >
                      &gt;&gt;
                    </Button>
                  </div>
                </InputGroup>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Page>
    );
  }
}
export default OutletPage;
