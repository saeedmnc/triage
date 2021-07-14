import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import{Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeriajItemsService {


  constructor( private http:HttpClient) { }
  public TransporterUrl='/api/Triage/Get_TransportList';
  public DepartureListUrl='/api/Triage/Get_DepartureList';
  public EntranceTypeListUrl='/api/Triage/Get_EntranceTypeList';
  public TriageLevelList="/api/Triage/Get_TriageLevelList";
  public getGenderListUrl="/api/Triage/Get_GenderList";
  public getPragnentListURl="/api/Triage/Get_PragnentList";
  public Encounter24HoursAgoListUrl="/api/Triage/Get_Encounter24HoursAgoList";
  public FoodSensitivityListUrl="/api/Triage/Get_FoodSensitivityList";
  public AgeTypeListUrl="/api/Triage/Get_AgeTypeList ";
  public  SeparationByInfectionListUrl="/api/Triage/Get_SeparationByInfectionList";
  public  getMainDiseaseListURL="/api/Triage/Get_MainDiseaseList";
  public getTriageAllergyDrugsURL="​/api​/Triage​/Get_TriageAllergyDrugs";
  public GetSepasListUrl="/api/DrugStore/Get_Sepas_ERX_List";
  public GetTriageStatusListUrl="/api/Triage/Get_TriageStatusList"
    public postPracIDUrl="/api/Triage/Get_TriagePractitioner"
    public getHospitalNameUrl="/api/Hospital/HospitalInformation"
    baseurl: any;
    seturl(url: any) {
        this.baseurl = url;
    }
    getHospitalName():Observable<any>{
        const headerDict = {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
        const requestOptions = {
            headers: new Headers(headerDict),
        };
        return this.http.get<any>(this.baseurl+this.getHospitalNameUrl,{
            headers:headerDict
        })
    }
    GetTriageStatusList(){
        const headerDict = {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
        const requestOptions = {
            headers: new Headers(headerDict),
        };
        return this.http.get<any>(this.baseurl+this.GetTriageStatusListUrl,{
            headers:headerDict
        })
    }
  getTransportList(): Observable<any>{
    const headerDict = {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
    const requestOptions = {
      headers: new Headers(headerDict),
    };
    return this.http.get<any>(this.baseurl+this.TransporterUrl,{
      headers:headerDict
    })
  }
  getDepartureList():Observable<any>{
    const headerDict = {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
    const requestOptions = {
      headers: new Headers(headerDict),
    };
    return this.http.get<any>(this.baseurl+this.DepartureListUrl,{
      headers:headerDict
    })
  }
  getEntranceTypeList():Observable<any>{
    const headerDict = {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
    const requestOptions = {
      headers: new Headers(headerDict),
    };
    return this.http.get<any>(this.baseurl+this.EntranceTypeListUrl,{
      headers:headerDict
    })
  }
  getTriageLevelList(): Observable<any>{
    const headerDict = {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
    const requestOptions = {
      headers: new Headers(headerDict),
    };
    return this.http.get<any>(this.baseurl+this.TriageLevelList,{
      headers:headerDict
    })
  }
  getGenderList(): Observable<any>{
    const headerDict = {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
    const requestOptions = {
      headers: new Headers(headerDict),
    };
    return this.http.get<any>(this.baseurl+this.getGenderListUrl,{
      headers:headerDict
    })
  }
getPragnentList(): Observable<any>{
  const headerDict = {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
  const requestOptions = {
    headers: new Headers(headerDict),
  };
  return this.http.get<any>(this.baseurl+this.getPragnentListURl,{
    headers:headerDict
  })
}
getEncounter24HoursAgoList(): Observable<any>{
  const headerDict = {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
  const requestOptions = {
    headers: new Headers(headerDict),
  };
  return this.http.get<any>(this.baseurl+this.Encounter24HoursAgoListUrl,{
    headers:headerDict
  })
}
getFoodSensitivityList(){
  const headerDict = {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
  const requestOptions = {
    headers: new Headers(headerDict),
  };
  return this.http.get<any>(this.baseurl+this.FoodSensitivityListUrl,{
    headers:headerDict
  })
}
getAgeTypeList(){
  const headerDict = {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
  const requestOptions = {
    headers: new Headers(headerDict),
  };
  return this.http.get<any>(this.baseurl+this.AgeTypeListUrl,{
    headers:headerDict
  })

}
GetSeparationByInfectionList(){
  const headerDict = {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
  const requestOptions = {
    headers: new Headers(headerDict),
  };
  return this.http.get<any>(this.baseurl+this.SeparationByInfectionListUrl,{
    headers:headerDict
  })

}
getMainDiseaseList(){
  const headerDict = {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
  const requestOptions = {
    headers: new Headers(headerDict),
  };
  return this.http.get<any>(this.baseurl+this.getMainDiseaseListURL,{
    headers:headerDict
  })

}
postPracID(id:string){
      const data={
          'pracID':id
      }
    const body = JSON.stringify(data );
    console.log(body);
    const headers = {  'Content-Type': 'application/json' };
    const headerDict = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer  ' + localStorage.getItem('token')
    }

    const requestOptions = {
        headers: new Headers(headerDict),
    };

    return   this.http.post<any>(this.baseurl+this.postPracIDUrl, body, {
        headers: headerDict
    });

}
// getFoodSesitivy(){
//   const data = {
//     'triageID': localStorage.getItem('teriazhid'),
//   };
// }
GetSepasList():Observable<any>{
  const headerDict = {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
  const requestOptions = {
    headers: new Headers(headerDict),
  };
  return this.http.get<any>(this.baseurl+this.GetSepasListUrl,{
    headers:headerDict
  })

}
getTriageAllergyDrugs(){
  const data={
    'triageID': localStorage.getItem('teriazhid'),
  }
  const body = JSON.stringify(data );
    console.log(body);
    const headers = {  'Content-Type': 'application/json' };
    const headerDict = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer  ' + localStorage.getItem('token')
    }

    const requestOptions = {
        headers: new Headers(headerDict),
    };

    return  this.http.post<any>(this.baseurl+this.getTriageAllergyDrugsURL, body, {
        headers: headerDict
    });
}


 

}
