const translit = (str: string): string => {
	const ru =
		'А-а-Б-б-В-в-Г-г-Д-д-Е-е-Ё-ё-Ж-ж-З-з-И-и-Й-й-К-к-Л-л-М-м-Н-н-О-о-П-п-Р-р-С-с-Т-т-У-у-Ф-ф-Х-х-Ц-ц-Ч-ч-Ш-ш-Щ-щ-Ы-ы-Э-э-Ю-ю-Я-я'.split(
			'-'
		) // Кириллические символы
	const en =
		'A-a-B-b-V-v-G-g-D-d-E-e-E-yo-Zh-zh-Z-z-I-i-Y-y-K-k-L-l-M-m-N-n-O-o-P-p-R-r-S-s-T-t-U-u-F-f-Kh-kh-Ts-ts-Ch-ch-Sh-sh-Shch-shch-Y-y-E-e-Yu-yu-Ya-ya'.split(
			'-'
		) // Латинские символы

	let res = ''
	for (let i = 0, l = str.length; i < l; i++) {
		const s = str.charAt(i),
			n = ru.indexOf(s) // Находим индекс кириллической буквы
		if (n >= 0) {
			res += en[n] // Соответствующая латиница
		} else {
			res += s // Если символ не кириллический
		}
	}
	return res // Возвращаем транслитерированную строку
}

export const generateSlug = (str: string): string => {
	let url: string = str.replace(/[\s]+/gi, '-') // Заменяем пробелы на "-"

	url = translit(url) // Транслитерируем строку

	url = url
		.replace(/[^0-9a-z\-]+/gi, '') // Удаляем все символы, кроме цифр, латиницы и дефиса
		.replace(/---/g, '-') // Меняем тройные дефисы на один
		.replace(/--/g, '-') // Меняем двойные дефисы на один
		.toLowerCase() // Приводим к нижнему регистру

	return url // Возвращаем итоговый слаг
}
