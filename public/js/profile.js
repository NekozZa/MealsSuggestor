const profile = document.querySelector('.profile-tab')
const enrolment = document.querySelector('.enrolment-tab')
const tabs = [profile, enrolment]

profile.onclick = (e) => {
    tabs.forEach((tab) => {
        tab.classList.remove('selected')
    })

    profile.classList.add('selected')
    const enrolmentInfo = document.querySelector('.enrolment-info')
    enrolmentInfo.style.display = 'none'

    const formInfos = document.querySelectorAll('.form-info')
    formInfos.forEach((formInfo) => {
        formInfo.style.display = 'block'
    })
}

enrolment.onclick = (e) => {
    tabs.forEach((tab) => {
        tab.classList.remove('selected')
    })

    enrolment.classList.add('selected')
    const enrolmentInfo = document.querySelector('.enrolment-info')
    enrolmentInfo.style.display = 'block'

    const formInfos = document.querySelectorAll('.form-info')
    formInfos.forEach((formInfo) => {
        formInfo.style.display = 'none'
    })
}