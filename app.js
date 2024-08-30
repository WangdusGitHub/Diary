// 1. load diary summeries from localStorage.
// 2. on diarySummery "click" -> maximize the size of current diary,
//    set diary -> zIndex = '1'
//    and set main -> "overflow = hidden and width = height: calc(100svh - 6rem);"
// 3. on saveBtn -> save the diary in localStorage with date.
// 4. on deleteBtn -> delete the current diary from localStorage.
//    and open diary summeries.
// 5. on backBtn -> save the current diary,
//    minimize the current diary 
//    and load other diary summeries. 
// 6. on New+ -> save the current diary and back to diarySummiries, 
//    then create a new diary summery with date but no text.


let main = document.querySelector('#main');

const showMessage = (message) => {
    let msgBox = document.querySelector('span');
    msgBox.innerText = message;
    msgBox.classList.add('down-up-animation');

    setTimeout(() => {
        msgBox.classList.remove('down-up-animation');
        msgBox.innerText = '';
    }, 2000);
};

const saveDiary = () => {
    let diaries = document.querySelectorAll('.text');
    let diaryDates = document.querySelectorAll('.date');

    let diaryData = [];
    let diaryDatesData = [];

    diaries.forEach(diary => {
        diaryData.push(diary.value);
    })
    diaryDates.forEach(diaryDate => {
        diaryDatesData.push(diaryDate.value);
    })
    diaryData.reverse();
    diaryDatesData.reverse();

    localStorage.setItem('diaryData', JSON.stringify(diaryData));
    localStorage.setItem('diaryDatesData', JSON.stringify(diaryDatesData));

    showMessage('diary saved...');
}


const openDiary = (id) => {
    let diaries = document.querySelectorAll('.diarySummery');
    diaries.forEach(diary => {
        if (id == diary.id) {
            diary.style.transition = '.3s';
            diary.setAttribute('class', 'diary');
        } else {
            diary.style.display = 'none';
        }
    })
    main.style.height = 'height: calc(100svh - 6rem);';
}


const goBack = () => {

    try{
        let diary = document.querySelector('.diary');
        diary.setAttribute('class', 'diarySummery');
    } catch(diary) {
        console.log('diary is not found!!');
    }

    let diaries = document.querySelectorAll('.diarySummery');
    diaries.forEach(diarySummery => {
        diarySummery.style.display = 'flex';
    })

    main.style.height = 'none';
    saveDiary();
}


const deleteDiary = () => {
    if (confirm('Deleting the current diary') == false) {
        return;
    } else {
        let diary = document.querySelector('.diary');
        diary.remove();
        goBack();
        showMessage('diary deleted...');
    }
}


const getTodaysDate = () => {
    let date = new Date();
    let todaysDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    return todaysDate;
}


let idCount = 0;
const createDiary = (text, date) => {
    let diary = document.createElement('div');
    diary.classList.add('diarySummery');
    diary.id = idCount;
    diary.innerHTML = `
        <div class="btns">
            <button class="backBtn" onclick="goBack(id=${idCount})"><i class="fa-solid fa-arrow-left"></i></button>
            <button class="saveBtn" onclick="saveDiary()"><i class="fa-regular fa-floppy-disk"></i></button>
            <button class="deleteBtn" onclick="deleteDiary()"><i class="fa-regular fa-trash-can"></i></button>
        </div>
        <button class="openBtn" onclick="openDiary(id=${idCount})"></button>
        <textarea name="text" class="text" placeholder="What happened today!!">${text}</textarea>
        <textarea name="date" class="date" disabled>${date}</textarea>
    `
    idCount++;
    return diary;
}


const addDiarySummery = (text = "", date = "") => {
    try{
        let diary = document.querySelector('.diary');
        console.log('going back')
        goBack();
    } catch(diary) {
        console.log('no opened diary found!!');
    }

    if (date == "") {
        date = getTodaysDate();
    }

    let diary = createDiary(text, date);

    main.prepend(diary); 
}



(
    function() {        //--------- load diaries that are stored in local storage.---------
        diaries = JSON.parse(localStorage.getItem('diaryData'));
        diaryDates = JSON.parse(localStorage.getItem('diaryDatesData'));

        diaries.forEach((diary, idx) => {
            addDiarySummery(diary, diaryDates[idx]);
        });
        saveDiary();
    }
)()

const onBtn = () => {
    document.querySelector('.add').style.boxShadow = '0px 0px 10px 1px rgb(255, 255, 0)';
}
const offBtn = () => {
    document.querySelector('.add').style.boxShadow = 'none';
}
document.querySelector('.add').addEventListener('mouseup', onBtn);
document.querySelector('.add').addEventListener('mousedown', offBtn);
